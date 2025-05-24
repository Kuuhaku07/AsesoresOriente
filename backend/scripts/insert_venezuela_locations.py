"""
Script para insertar los datos de estados, ciudades y zonas de Venezuela en la base de datos PostgreSQL.
El script lee un archivo JSON con la estructura de los datos y realiza inserciones en las tablas Estado, Ciudad y Zona.
Utiliza la funcionalidad ON CONFLICT DO NOTHING para evitar duplicados.
Las claves foráneas se resuelven consultando los IDs por nombre para evitar hardcodear IDs.

Variables de conexión a la base de datos se leen desde el archivo .env para mayor seguridad y flexibilidad.

Requiere instalar las librerías:
- psycopg2
- python-dotenv

Ejemplo de uso:
    python insert_venezuela_locations.py
"""

import json
import psycopg2
from psycopg2.extras import execute_values
from dotenv import load_dotenv
import os
from typing import Optional

def load_data(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_estado_id(cursor, nombre_estado: str) -> Optional[int]:
    """Obtiene el ID de un estado por su nombre"""
    cursor.execute('SELECT id FROM "Estado" WHERE nombre = %s', (nombre_estado,))
    result = cursor.fetchone()
    return result[0] if result else None

def get_ciudad_id_by_name(cursor, nombre_ciudad: str) -> Optional[int]:
    """Obtiene el ID de una ciudad por su nombre"""
    cursor.execute('''
        SELECT c.id 
        FROM "Ciudad" c
        JOIN "Estado" e ON c.estado_id = e.id
        WHERE c.nombre = %s
        LIMIT 1
    ''', (nombre_ciudad,))
    result = cursor.fetchone()
    return result[0] if result else None

def insert_estados(cursor, estados):
    sql = '''
    INSERT INTO "Estado" (nombre, codigo)
    VALUES %s
    ON CONFLICT (nombre) DO NOTHING
    '''
    values = [(e['nombre'], e['codigo']) for e in estados]
    execute_values(cursor, sql, values)

def insert_ciudades(cursor, ciudades):
    for ciudad in ciudades:
        estado_id = get_estado_id(cursor, ciudad['estado'])
        if estado_id is None:
            print(f"Estado no encontrado para la ciudad: {ciudad['nombre']}")
            continue
        sql = '''
        INSERT INTO "Ciudad" (estado_id, nombre)
        VALUES (%s, %s)
        ON CONFLICT (estado_id, nombre) DO NOTHING
        '''
        cursor.execute(sql, (estado_id, ciudad['nombre']))

def insert_zonas(cursor, zonas):
    for zona in zonas:
        ciudad_id = get_ciudad_id_by_name(cursor, zona['ciudad'])
        if not ciudad_id:
            print(f"Ciudad no encontrada para la zona: {zona['nombre']}")
            continue
            
        cursor.execute('''
            INSERT INTO "Zona" (ciudad_id, nombre, codigo_postal)
            VALUES (%s, %s, %s)
            ON CONFLICT (ciudad_id, nombre) 
            DO UPDATE SET codigo_postal = EXCLUDED.codigo_postal
        ''', (ciudad_id, zona['nombre'], zona.get('codigo_postal')))

def main():
    load_dotenv()
    data = load_data('venezuela_locations.json')
    conn = psycopg2.connect(
        dbname=os.getenv('DB_NAME'),
        user=os.getenv('DB_USER'),
        password=os.getenv('DB_PASSWORD'),
        host=os.getenv('DB_HOST'),
        port=os.getenv('DB_PORT')
    )
    try:
        with conn:
            with conn.cursor() as cursor:
                insert_estados(cursor, data['estados'])
                insert_ciudades(cursor, data['ciudades'])
                insert_zonas(cursor, data['zonas'])
        print("Datos insertados/actualizados correctamente.")
    except Exception as e:
        print(f"Error al procesar datos: {e}")
        raise
    finally:
        conn.close()

if __name__ == '__main__':
    main()