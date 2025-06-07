import json
import logging
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv
import os
from typing import Dict, List

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('tipo_caracteristica_sync.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def load_data(filepath: str) -> List[Dict]:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if not isinstance(data, list):
            raise ValueError("JSON inválido: se esperaba una lista de tipos de característica")
        for item in data:
            if 'nombre' not in item:
                raise ValueError("JSON inválido: cada tipo debe tener un campo 'nombre'")
        return data
    except Exception as e:
        logger.error(f"Error cargando JSON: {str(e)}")
        raise

def sync_tipo_caracteristica(cursor, tipos_json: List[Dict]):
    try:
        cursor.execute('CREATE TEMP TABLE temp_tipo_caracteristica (nombre text, unidad_medida text, es_prioritaria boolean) ON COMMIT DROP')
        execute_values(
            cursor,
            'INSERT INTO temp_tipo_caracteristica VALUES %s',
            [(t['nombre'], t.get('unidad_medida', None), t.get('es_prioritaria', False)) for t in tipos_json]
        )
        cursor.execute('''
            -- Actualizar existentes
            UPDATE "TipoCaracteristica" tc
            SET unidad_medida = t.unidad_medida,
                es_prioritaria = t.es_prioritaria
            FROM temp_tipo_caracteristica t
            WHERE tc.nombre = t.nombre;

            -- Insertar nuevos
            INSERT INTO "TipoCaracteristica" (nombre, unidad_medida, es_prioritaria)
            SELECT t.nombre, t.unidad_medida, t.es_prioritaria
            FROM temp_tipo_caracteristica t
            LEFT JOIN "TipoCaracteristica" tc ON tc.nombre = t.nombre
            WHERE tc.id IS NULL;

            -- Eliminar obsoletos
            DELETE FROM "TipoCaracteristica" tc
            WHERE NOT EXISTS (
                SELECT 1 FROM temp_tipo_caracteristica t
                WHERE t.nombre = tc.nombre
            );
        ''')
        logger.info(f"Sincronizados {len(tipos_json)} tipos de característica")
    except Exception as e:
        logger.error(f"Error sincronizando tipos de característica: {str(e)}")
        raise

def main():
    load_dotenv()
    try:
        data = load_data('tipo_caracteristica.json')
        conn = psycopg2.connect(
            dbname=os.getenv('DB_NAME'),
            user=os.getenv('DB_USER'),
            password=os.getenv('DB_PASSWORD'),
            host=os.getenv('DB_HOST'),
            port=os.getenv('DB_PORT')
        )
        conn.autocommit = False
        try:
            with conn:
                with conn.cursor() as cursor:
                    logger.info("Iniciando sincronización de tipos de característica...")
                    sync_tipo_caracteristica(cursor, data)
                    logger.info("Sincronización de tipos de característica completada exitosamente")
        except Exception as e:
            conn.rollback()
            logger.error(f"Error en transacción: {str(e)}", exc_info=True)
            raise
        finally:
            conn.close()
    except Exception as e:
        logger.critical(f"Error crítico: {str(e)}", exc_info=True)
        raise

if __name__ == '__main__':
    main()
