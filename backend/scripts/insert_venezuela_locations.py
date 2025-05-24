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

def load_data(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)

def get_estado_id(cursor, nombre):
    cursor.execute('SELECT id FROM "Estado" WHERE nombre = %s', (nombre,))
    result = cursor.fetchone()
    return result[0] if result else None

def get_ciudad_id(cursor, nombre, estado_id):
    cursor.execute('SELECT id FROM "Ciudad" WHERE nombre = %s AND estado_id = %s', (nombre, estado_id))
    result = cursor.fetchone()
    return result[0] if result else None

def insert_estados(cursor, estados):
    # Insert or update estados
    sql = '''
    INSERT INTO "Estado" (nombre, codigo)
    VALUES %s
    ON CONFLICT (nombre) DO NOTHING
    '''
    values = [(e['nombre'], e['codigo']) for e in estados]
    execute_values(cursor, sql, values)

    # Deletion of estados not in JSON removed as per user request

def insert_ciudades(cursor, ciudades):
    # Insert or update ciudades
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

    # Deletion of ciudades not in JSON removed as per user request

def insert_zonas(cursor, zonas):
    # Insert or update zonas
    for zona in zonas:
        cursor.execute('''
            SELECT id, codigo_postal FROM "Zona" WHERE nombre = %s
        ''', (zona['nombre'],))
        result = cursor.fetchone()
        if result:
            zona_id, codigo_postal_actual = result
            if codigo_postal_actual != zona.get('codigo_postal'):
                # Actualizar código postal si es diferente
                cursor.execute('''
                    UPDATE "Zona" SET codigo_postal = %s WHERE id = %s
                ''', (zona.get('codigo_postal'), zona_id))
        else:
            # Insertar nueva zona si no existe
            cursor.execute('''
                SELECT c.id FROM "Ciudad" c
                JOIN "Estado" e ON c.estado_id = e.id
                WHERE c.nombre = %s
            ''', (zona['ciudad'],))
            ciudad_result = cursor.fetchone()
            if not ciudad_result:
                print(f"Ciudad no encontrada para la zona: {zona['nombre']}")
                continue
            ciudad_id = ciudad_result[0]
            sql = '''
            INSERT INTO "Zona" (ciudad_id, nombre, codigo_postal)
            VALUES (%s, %s, %s)
            ON CONFLICT (ciudad_id, nombre) DO NOTHING
            '''
            cursor.execute(sql, (ciudad_id, zona['nombre'], zona.get('codigo_postal')))

    # Deletion of zonas not in JSON removed as per user request

def main():
    load_dotenv()  # Carga variables de entorno desde .env
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
        print("Datos de ubicación insertados correctamente.")
    except Exception as e:
        print(f"Error al insertar datos: {e}")
    finally:
        conn.close()

if __name__ == '__main__':
    main()
