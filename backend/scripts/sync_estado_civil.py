import json
import logging
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv
import os
from typing import Dict, List

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('estado_civil_sync.log'),
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
            raise ValueError("JSON inválido: se esperaba una lista de estados civiles")
        for item in data:
            if 'nombre' not in item:
                raise ValueError("JSON inválido: cada estado civil debe tener un campo 'nombre'")
        return data
    except Exception as e:
        logger.error(f"Error cargando JSON: {str(e)}")
        raise

def sync_estado_civil(cursor, estados_json: List[Dict]):
    """Sincroniza estados civiles (INSERT/UPDATE/DELETE)"""
    try:
        cursor.execute('CREATE TEMP TABLE temp_estado_civil (nombre text) ON COMMIT DROP')
        execute_values(
            cursor,
            'INSERT INTO temp_estado_civil VALUES %s',
            [(e['nombre'],) for e in estados_json]
        )
        
        cursor.execute('''
            -- Actualizar existentes
            UPDATE "EstadoCivil" ec
            SET nombre = t.nombre
            FROM temp_estado_civil t
            WHERE ec.nombre = t.nombre;
            
            -- Insertar nuevos
            INSERT INTO "EstadoCivil" (nombre)
            SELECT t.nombre
            FROM temp_estado_civil t
            LEFT JOIN "EstadoCivil" ec ON ec.nombre = t.nombre
            WHERE ec.id IS NULL;
            
            -- Eliminar obsoletos
            DELETE FROM "EstadoCivil" ec
            WHERE NOT EXISTS (
                SELECT 1 FROM temp_estado_civil t
                WHERE t.nombre = ec.nombre
            );
        ''')
        logger.info(f"Sincronizados {len(estados_json)} estados civiles")
    except Exception as e:
        logger.error(f"Error sincronizando estados civiles: {str(e)}")
        raise

def main():
    load_dotenv()
    
    try:
        data = load_data('estados_civiles.json')
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
                    logger.info("Iniciando sincronización de estados civiles...")
                    sync_estado_civil(cursor, data)
                    logger.info("Sincronización de estados civiles completada exitosamente")
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
