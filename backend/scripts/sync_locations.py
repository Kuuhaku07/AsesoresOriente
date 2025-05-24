"""
Script mejorado para sincronizar estados, ciudades y zonas de Venezuela en PostgreSQL.
Realiza operaciones CRUD completas basadas en el archivo JSON de referencia.

Mejoras incluidas:
1. Logging estructurado
2. Validación de datos
3. Sincronización completa (INSERT/UPDATE/DELETE)
4. Manejo robusto de errores
5. Transacciones explícitas
6. Batch processing para mejor rendimiento

Requerimientos:
- psycopg2-binary
- python-dotenv
"""
import json
import logging
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv
import os
from typing import Dict, List, Set, Optional

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('location_sync.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

def load_data(filepath: str) -> Dict:
    """Carga y valida el archivo JSON"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        if not all(key in data for key in ['estados', 'ciudades', 'zonas']):
            raise ValueError("JSON inválido: faltan secciones requeridas")
            
        return data
    except Exception as e:
        logger.error(f"Error cargando JSON: {str(e)}")
        raise

def get_estado_id(cursor, nombre: str) -> Optional[int]:
    """Obtiene ID de estado por nombre"""
    cursor.execute('SELECT id FROM "Estado" WHERE nombre = %s', (nombre,))
    result = cursor.fetchone()
    return result[0] if result else None

def get_ciudad_id(cursor, nombre: str, estado_id: int) -> Optional[int]:
    """Obtiene ID de ciudad por nombre y estado"""
    cursor.execute(
        'SELECT id FROM "Ciudad" WHERE nombre = %s AND estado_id = %s', 
        (nombre, estado_id)
    )
    result = cursor.fetchone()
    return result[0] if result else None

def get_ciudad_id_by_name(cursor, nombre_ciudad: str) -> Optional[int]:
    """Obtiene ID de ciudad solo por nombre (para uso en zonas)"""
    cursor.execute('''
        SELECT id FROM "Ciudad" WHERE nombre = %s LIMIT 1
    ''', (nombre_ciudad,))
    result = cursor.fetchone()
    return result[0] if result else None

def validate_codigo_postal(codigo: str) -> bool:
    """Valida formato de código postal"""
    if not codigo or not isinstance(codigo, str):
        return False
    return codigo.isdigit() and 4 <= len(codigo) <= 5

def sync_estados(cursor, estados_json: List[Dict]):
    """Sincroniza estados (INSERT/UPDATE/DELETE)"""
    try:
        cursor.execute('CREATE TEMP TABLE temp_estados (nombre text, codigo text) ON COMMIT DROP')
        execute_values(
            cursor,
            'INSERT INTO temp_estados VALUES %s',
            [(e['nombre'], e['codigo']) for e in estados_json]
        )
        
        cursor.execute('''
            -- Actualizar existentes
            UPDATE "Estado" e
            SET codigo = t.codigo
            FROM temp_estados t
            WHERE e.nombre = t.nombre;
            
            -- Insertar nuevos
            INSERT INTO "Estado" (nombre, codigo)
            SELECT t.nombre, t.codigo
            FROM temp_estados t
            LEFT JOIN "Estado" e ON e.nombre = t.nombre
            WHERE e.id IS NULL;
            
            -- Eliminar obsoletos
            DELETE FROM "Estado" e
            WHERE NOT EXISTS (
                SELECT 1 FROM temp_estados t 
                WHERE t.nombre = e.nombre
            );
        ''')
        logger.info(f"Sincronizados {len(estados_json)} estados")
    except Exception as e:
        logger.error(f"Error sincronizando estados: {str(e)}")
        raise

def sync_ciudades(cursor, ciudades_json: List[Dict]):
    """Sincroniza ciudades con manejo de errores mejorado"""
    try:
        cursor.execute('SELECT nombre, id FROM "Estado"')
        estado_ids = {nombre: id for nombre, id in cursor.fetchall()}
        
        # Filtrar ciudades con estados válidos
        ciudades_validas = [
            (c['nombre'], c['estado'])
            for c in ciudades_json 
            if c['estado'] in estado_ids
        ]
        
        # Registrar ciudades con estados no encontrados
        for ciudad in ciudades_json:
            if ciudad['estado'] not in estado_ids:
                logger.warning(f"Estado no encontrado para ciudad: {ciudad['nombre']}")

        cursor.execute('CREATE TEMP TABLE temp_ciudades (nombre text, estado_nombre text) ON COMMIT DROP')
        execute_values(cursor, 'INSERT INTO temp_ciudades VALUES %s', ciudades_validas)
        
        cursor.execute('''
            -- Insertar nuevas ciudades
            INSERT INTO "Ciudad" (estado_id, nombre)
            SELECT e.id, t.nombre
            FROM temp_ciudades t
            JOIN "Estado" e ON e.nombre = t.estado_nombre
            LEFT JOIN "Ciudad" c ON c.nombre = t.nombre AND c.estado_id = e.id
            WHERE c.id IS NULL;
            
            -- Eliminar ciudades obsoletas
            DELETE FROM "Ciudad" c
            USING "Estado" e
            WHERE c.estado_id = e.id AND NOT EXISTS (
                SELECT 1 FROM temp_ciudades t
                WHERE t.nombre = c.nombre AND t.estado_nombre = e.nombre
            );
        ''')
        logger.info(f"Procesadas {len(ciudades_validas)} ciudades válidas")
    except Exception as e:
        logger.error(f"Error sincronizando ciudades: {str(e)}")
        raise

def sync_zonas(cursor, zonas_json: List[Dict]):
    """Sincroniza zonas con validación mejorada"""
    try:
        # Validar zonas
        zonas_validadas = []
        for zona in zonas_json:
            cp = zona.get('codigo_postal', '')
            if not validate_codigo_postal(cp):
                logger.warning(f"Zona {zona['nombre']} omitida - código postal inválido: {cp}")
                continue
            zonas_validadas.append(zona)

        # Crear tabla temporal con zonas válidas
        cursor.execute('''
            CREATE TEMP TABLE temp_zonas (
                nombre text,
                ciudad_nombre text,
                codigo_postal text
            ) ON COMMIT DROP
        ''')
        
        execute_values(
            cursor,
            'INSERT INTO temp_zonas VALUES %s',
            [(z['nombre'], z['ciudad'], z['codigo_postal']) for z in zonas_validadas]
        )

        # Sincronización completa
        cursor.execute('''
            -- Paso 1: Actualizar existentes
            UPDATE "Zona" z
            SET codigo_postal = t.codigo_postal
            FROM temp_zonas t
            JOIN "Ciudad" c ON c.nombre = t.ciudad_nombre
            WHERE z.nombre = t.nombre AND z.ciudad_id = c.id;
            
            -- Paso 2: Insertar nuevas
            INSERT INTO "Zona" (ciudad_id, nombre, codigo_postal)
            SELECT c.id, t.nombre, t.codigo_postal
            FROM temp_zonas t
            JOIN "Ciudad" c ON c.nombre = t.ciudad_nombre
            LEFT JOIN "Zona" z ON z.nombre = t.nombre AND z.ciudad_id = c.id
            WHERE z.id IS NULL;
            
            -- Paso 3: Eliminar obsoletas
            DELETE FROM "Zona" z
            WHERE NOT EXISTS (
                SELECT 1 FROM temp_zonas t
                JOIN "Ciudad" c ON c.nombre = t.ciudad_nombre
                WHERE z.nombre = t.nombre AND z.ciudad_id = c.id
            );
        ''')
        logger.info(f"Sincronizadas {len(zonas_validadas)} zonas válidas")
    except Exception as e:
        logger.error(f"Error sincronizando zonas: {str(e)}")
        raise

def main():
    load_dotenv()
    
    try:
        data = load_data('venezuela_locations.json')
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
                    logger.info("Iniciando sincronización completa...")
                    sync_estados(cursor, data['estados'])
                    sync_ciudades(cursor, data['ciudades'])
                    sync_zonas(cursor, data['zonas'])
                    logger.info("Sincronización completada exitosamente")
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