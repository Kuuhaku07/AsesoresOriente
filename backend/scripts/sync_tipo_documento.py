"""
Script para sincronizar los tipos de documentos en la base de datos.
Lee una lista de tipos de documentos y realiza operaciones CRUD para mantener la base de datos actualizada.
"""

import json
import logging
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv
import os
from typing import List, Dict

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('tipo_documento_sync.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def load_data(filepath: str) -> List[Dict]:
    """Carga y valida el archivo JSON con tipos de documentos"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        if not isinstance(data, list):
            raise ValueError("JSON inválido: se esperaba una lista de tipos de documentos")
        for item in data:
            if 'nombre' not in item:
                raise ValueError("JSON inválido: cada tipo de documento debe tener un campo 'nombre'")
            if 'descripcion' not in item:
                item['descripcion'] = None
            if 'requerido' not in item:
                item['requerido'] = False
            if 'aplica_inmueble' not in item:
                item['aplica_inmueble'] = True
            if 'aplica_propietario' not in item:
                item['aplica_propietario'] = True
        return data
    except Exception as e:
        logger.error(f"Error cargando JSON: {str(e)}")
        raise

def sync_tipo_documento(cursor, tipos_json: List[Dict]):
    """Sincroniza tipos de documentos (INSERT/UPDATE/DELETE)"""
    try:
        cursor.execute('CREATE TEMP TABLE temp_tipo_documento (nombre text, descripcion text, requerido boolean, aplica_inmueble boolean, aplica_propietario boolean) ON COMMIT DROP')
        execute_values(
            cursor,
            'INSERT INTO temp_tipo_documento VALUES %s',
            [(t['nombre'], t['descripcion'], t['requerido'], t['aplica_inmueble'], t['aplica_propietario']) for t in tipos_json]
        )
        
        cursor.execute('''
            -- Actualizar existentes
            UPDATE "TipoDocumento" td
            SET descripcion = t.descripcion,
                requerido = t.requerido,
                aplica_inmueble = t.aplica_inmueble,
                aplica_propietario = t.aplica_propietario
            FROM temp_tipo_documento t
            WHERE td.nombre = t.nombre;
            
            -- Insertar nuevos
            INSERT INTO "TipoDocumento" (nombre, descripcion, requerido, aplica_inmueble, aplica_propietario)
            SELECT t.nombre, t.descripcion, t.requerido, t.aplica_inmueble, t.aplica_propietario
            FROM temp_tipo_documento t
            LEFT JOIN "TipoDocumento" td ON td.nombre = t.nombre
            WHERE td.id IS NULL;
            
            -- Eliminar obsoletos
            DELETE FROM "TipoDocumento" td
            WHERE NOT EXISTS (
                SELECT 1 FROM temp_tipo_documento t
                WHERE t.nombre = td.nombre
            );
        ''')
        logger.info(f"Sincronizados {len(tipos_json)} tipos de documentos")
    except Exception as e:
        logger.error(f"Error sincronizando tipos de documentos: {str(e)}")
        raise

def main():
    load_dotenv()
    
    try:
        data = load_data('document_types.json')  # Cambiado para usar el archivo correcto con tipos de documentos
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
                    logger.info("Iniciando sincronización de tipos de documentos...")
                    sync_tipo_documento(cursor, data)
                    logger.info("Sincronización de tipos de documentos completada exitosamente")
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
