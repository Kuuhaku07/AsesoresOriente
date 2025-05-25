import json
import logging
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv
import os
from typing import Dict, List, Optional

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('property_type_sync.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def load_data(filepath: str) -> List[Dict]:
    """Carga y valida el archivo JSON"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if not isinstance(data, list):
            raise ValueError("JSON inválido: se esperaba una lista de tipos de inmueble")
        for item in data:
            if 'nombre' not in item:
                raise ValueError("JSON inválido: cada tipo debe tener un campo 'nombre'")
        return data
    except Exception as e:
        logger.error(f"Error cargando JSON: {str(e)}")
        raise

def sync_tipo_inmueble(cursor, tipos_json: List[Dict]):
    """Sincroniza tipos de inmueble (INSERT/UPDATE/DELETE)"""
    try:
        cursor.execute('CREATE TEMP TABLE temp_tipo_inmueble (nombre text, descripcion text, icono text) ON COMMIT DROP')
        execute_values(
            cursor,
            'INSERT INTO temp_tipo_inmueble VALUES %s',
            [(t['nombre'], t.get('descripcion', None), t.get('icono', None)) for t in tipos_json]
        )
        
        cursor.execute('''
            -- Actualizar existentes
            UPDATE "TipoInmueble" ti
            SET descripcion = t.descripcion,
                icono = t.icono
            FROM temp_tipo_inmueble t
            WHERE ti.nombre = t.nombre;
            
            -- Insertar nuevos
            INSERT INTO "TipoInmueble" (nombre, descripcion, icono)
            SELECT t.nombre, t.descripcion, t.icono
            FROM temp_tipo_inmueble t
            LEFT JOIN "TipoInmueble" ti ON ti.nombre = t.nombre
            WHERE ti.id IS NULL;
            
            -- Eliminar obsoletos
            DELETE FROM "TipoInmueble" ti
            WHERE NOT EXISTS (
                SELECT 1 FROM temp_tipo_inmueble t
                WHERE t.nombre = ti.nombre
            );
        ''')
        logger.info(f"Sincronizados {len(tipos_json)} tipos de inmueble")
    except Exception as e:
        logger.error(f"Error sincronizando tipos de inmueble: {str(e)}")
        raise

def main():
    load_dotenv()
    
    try:
        data = load_data('property_types.json')
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
                    logger.info("Iniciando sincronización de tipos de inmueble...")
                    sync_tipo_inmueble(cursor, data)
                    logger.info("Sincronización de tipos de inmueble completada exitosamente")
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
