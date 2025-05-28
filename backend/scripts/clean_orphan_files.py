"""
Script para eliminar archivos huérfanos en las carpetas de imágenes y documentos de inmuebles.
Compara los archivos en disco con los registros en la base de datos y elimina los que no están referenciados.
"""

import os
import psycopg2
from psycopg2.extras import RealDictCursor
from dotenv import load_dotenv
import logging

# Configuración de logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('clean_orphan_files.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

# Cargar variables de entorno
load_dotenv()

# Configuración de conexión a la base de datos
DB_CONFIG = {
    'dbname': os.getenv('DB_NAME'),
    'user': os.getenv('DB_USER'),
    'password': os.getenv('DB_PASSWORD'),
    'host': os.getenv('DB_HOST'),
    'port': os.getenv('DB_PORT')
}

# Rutas de las carpetas de imágenes y documentos
IMAGES_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'uploads', 'inmuebles', 'images')
DOCUMENTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'uploads', 'inmuebles', 'documents')

def get_referenced_files(conn):
    with conn.cursor(cursor_factory=RealDictCursor) as cur:
        cur.execute('SELECT ruta FROM "ImagenInmueble"')
        images = [os.path.basename(row['ruta']) for row in cur.fetchall()]
        cur.execute('SELECT ruta FROM "Documento"')
        documents = [os.path.basename(row['ruta']) for row in cur.fetchall()]
    return images, documents

def get_files_in_directory(directory):
    try:
        return os.listdir(directory)
    except Exception as e:
        logger.error(f"Error leyendo directorio {directory}: {e}")
        return []

def delete_file(filepath):
    try:
        os.remove(filepath)
        logger.info(f"Archivo eliminado: {filepath}")
    except Exception as e:
        logger.error(f"Error eliminando archivo {filepath}: {e}")

def main():
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        images_db, documents_db = get_referenced_files(conn)
        conn.close()

        images_disk = get_files_in_directory(IMAGES_DIR)
        documents_disk = get_files_in_directory(DOCUMENTS_DIR)

        orphan_images = [f for f in images_disk if f not in images_db]
        orphan_documents = [f for f in documents_disk if f not in documents_db]

        logger.info(f"Archivos huérfanos en imágenes: {len(orphan_images)}")
        logger.info(f"Archivos huérfanos en documentos: {len(orphan_documents)}")

        for f in orphan_images:
            delete_file(os.path.join(IMAGES_DIR, f))
        for f in orphan_documents:
            delete_file(os.path.join(DOCUMENTS_DIR, f))

    except Exception as e:
        logger.error(f"Error en limpieza de archivos huérfanos: {e}")

if __name__ == '__main__':
    main()
