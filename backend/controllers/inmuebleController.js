import * as inmuebleService from '../services/inmuebleService.js';
import fs from 'fs';
import path from 'path';

/**
 * Función utilitaria para eliminar archivos de forma segura.
 * @param {Array} filePaths - Array de rutas de archivos a eliminar.
 */
const deleteFiles = (filePaths) => {
  filePaths.forEach((filePath) => {
    const fullPath = path.join(process.cwd(), 'backend', filePath);
    fs.unlink(fullPath, (err) => {
      if (err) {
        console.error(`Error eliminando archivo ${fullPath}:`, err);
      } else {
        console.log(`Archivo eliminado: ${fullPath}`);
      }
    });
  });
};

/**
 * Controlador para crear un nuevo inmueble.
 */
export const createInmueble = async (req, res) => {
  try {
    const inmuebleData = req.body;

    // Asignar un valor por defecto para subidoPor en imágenes y documentos si no existe
    if (inmuebleData.imagenes && Array.isArray(inmuebleData.imagenes)) {
      inmuebleData.imagenes = inmuebleData.imagenes.map(img => ({
        ...img,
        subidoPor: img.subidoPor || (req.user ? req.user.id : null) // Asumir que req.user tiene info del usuario autenticado
      }));
    }
    if (inmuebleData.documentos && Array.isArray(inmuebleData.documentos)) {
      inmuebleData.documentos = inmuebleData.documentos.map(doc => ({
        ...doc,
        subidoPor: doc.subidoPor || (req.user ? req.user.id : null)
      }));
    }

    const newInmueble = await inmuebleService.createInmueble(inmuebleData);
    res.status(201).json(newInmueble);
  } catch (error) {
    console.error('Error creating inmueble:', error);

    // En caso de error, eliminar archivos subidos para evitar archivos huérfanos
    if (req.body) {
      const imagenes = req.body.imagenes || [];
      const documentos = req.body.documentos || [];
      const filePathsToDelete = [];

      imagenes.forEach(img => {
        if (img.ruta) {
          filePathsToDelete.push(img.ruta);
        }
      });
      documentos.forEach(doc => {
        if (doc.ruta) {
          filePathsToDelete.push(doc.ruta);
        }
      });

      if (filePathsToDelete.length > 0) {
        deleteFiles(filePathsToDelete);
      }
    }

    res.status(500).json({ error: 'Failed to create inmueble' });
  }
};

/**
 * Controlador para subir imágenes de inmueble.
 * Recibe archivos en 'images' y devuelve las rutas guardadas.
 */
export const uploadInmuebleImage = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se subieron imágenes' });
    }
    // Mapear archivos subidos a rutas accesibles
    const fileInfos = req.files.map(file => ({
      ruta: `/uploads/inmuebles/images/${file.filename}`,
      nombreOriginal: file.originalname,
      tamaño: file.size
    }));
    res.status(200).json({ archivos: fileInfos });
  } catch (error) {
    console.error('Error subiendo imágenes de inmueble:', error);
    res.status(500).json({ error: 'Error al subir imágenes' });
  }
};

/**
 * Controlador para subir documentos de inmueble.
 * Recibe archivos en 'documents' y devuelve las rutas guardadas.
 */
export const uploadInmuebleDocument = (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No se subieron documentos' });
    }
    // Mapear archivos subidos a rutas accesibles
    const fileInfos = req.files.map(file => ({
      ruta: `/uploads/inmuebles/documents/${file.filename}`,
      nombreOriginal: file.originalname,
      tamaño: file.size
    }));
    res.status(200).json({ archivos: fileInfos });
  } catch (error) {
    console.error('Error subiendo documentos de inmueble:', error);
    res.status(500).json({ error: 'Error al subir documentos' });
  }
};

/**
 * Controladores para obtener datos de opciones para dropdowns.
 */
export const getTipoInmuebles = async (req, res) => {
  try {
    const tipos = await inmuebleService.getTipoInmuebles();
    res.json(tipos);
  } catch (error) {
    console.error('Error getting tipoInmuebles:', error);
    res.status(500).json({ error: 'Failed to get tipoInmuebles' });
  }
};

export const getEstadoInmuebles = async (req, res) => {
  try {
    const estados = await inmuebleService.getEstadoInmuebles();
    res.json(estados);
  } catch (error) {
    console.error('Error getting estadoInmuebles:', error);
    res.status(500).json({ error: 'Failed to get estadoInmuebles' });
  }
};

export const getAsesores = async (req, res) => {
  try {
    const asesores = await inmuebleService.getAsesores();
    res.json(asesores);
  } catch (error) {
    console.error('Error getting asesores:', error);
    res.status(500).json({ error: 'Failed to get asesores' });
  }
};

export const getPropietariosPersona = async (req, res) => {
  try {
    const propietarios = await inmuebleService.getPropietariosPersona();
    res.json(propietarios);
  } catch (error) {
    console.error('Error getting propietarios persona:', error);
    res.status(500).json({ error: 'Failed to get propietarios persona' });
  }
};

export const getPropietariosEmpresa = async (req, res) => {
  try {
    const propietarios = await inmuebleService.getPropietariosEmpresa();
    res.json(propietarios);
  } catch (error) {
    console.error('Error getting propietarios empresa:', error);
    res.status(500).json({ error: 'Failed to get propietarios empresa' });
  }
};

export const getEstados = async (req, res) => {
  try {
    const estados = await inmuebleService.getEstados();
    res.json(estados);
  } catch (error) {
    console.error('Error getting estados:', error);
    res.status(500).json({ error: 'Failed to get estados' });
  }
};

export const getCiudades = async (req, res) => {
  try {
    const estadoId = req.params.estadoId;
    const ciudades = await inmuebleService.getCiudades(estadoId);
    res.json(ciudades);
  } catch (error) {
    console.error('Error getting ciudades:', error);
    res.status(500).json({ error: 'Failed to get ciudades' });
  }
};

export const getZonas = async (req, res) => {
  try {
    const ciudadId = req.params.ciudadId;
    const zonas = await inmuebleService.getZonas(ciudadId);
    res.json(zonas);
  } catch (error) {
    console.error('Error getting zonas:', error);
    res.status(500).json({ error: 'Failed to get zonas' });
  }
};

export const getTipoNegocios = async (req, res) => {
  try {
    const tipos = await inmuebleService.getTipoNegocios();
    res.json(tipos);
  } catch (error) {
    console.error('Error getting tipoNegocios:', error);
    res.status(500).json({ error: 'Failed to get tipoNegocios' });
  }
};

export const getCaracteristicas = async (req, res) => {
  try {
    const caracteristicas = await inmuebleService.getCaracteristicas();
    res.json(caracteristicas);
  } catch (error) {
    console.error('Error getting caracteristicas:', error);
    res.status(500).json({ error: 'Failed to get caracteristicas' });
  }
};

/**
 * Controladores para crear y actualizar propietarios persona y empresa
 */

export const createPropietarioPersona = async (req, res) => {
  try {
    const propietarioData = req.body;
    const newPropietario = await inmuebleService.createPropietarioPersona(propietarioData);
    res.status(201).json(newPropietario);
  } catch (error) {
    console.error('Error creating propietario persona:', error);
    res.status(500).json({ error: 'Failed to create propietario persona' });
  }
};

export const updatePropietarioPersona = async (req, res) => {
  try {
    const propietarioId = req.params.id;
    const propietarioData = req.body;
    const updatedPropietario = await inmuebleService.updatePropietarioPersona(propietarioId, propietarioData);
    res.json(updatedPropietario);
  } catch (error) {
    console.error('Error updating propietario persona:', error);
    res.status(500).json({ error: 'Failed to update propietario persona' });
  }
};

export const createPropietarioEmpresa = async (req, res) => {
  try {
    const propietarioData = req.body;
    const newPropietario = await inmuebleService.createPropietarioEmpresa(propietarioData);
    res.status(201).json(newPropietario);
  } catch (error) {
    console.error('Error creating propietario empresa:', error);
    res.status(500).json({ error: 'Failed to create propietario empresa' });
  }
};

export const updatePropietarioEmpresa = async (req, res) => {
  try {
    const propietarioId = req.params.id;
    const propietarioData = req.body;
    const updatedPropietario = await inmuebleService.updatePropietarioEmpresa(propietarioId, propietarioData);
    res.json(updatedPropietario);
  } catch (error) {
    console.error('Error updating propietario empresa:', error);
    res.status(500).json({ error: 'Failed to update propietario empresa' });
  }
};

export const getEstadoCivil = async (req, res) => {
  try {
    const estados = await inmuebleService.getEstadoCivil();
    res.json(estados);
  } catch (error) {
    console.error('Error getting estado civil:', error);
    res.status(500).json({ error: 'Failed to get estado civil' });
  }
};

/**
 * Obtiene los tipos de documento disponibles
 */
export const getTiposDocumento = async (req, res) => {
  try {
    const tipos = await inmuebleService.getTiposDocumento();
    res.json(tipos);
  } catch (error) {
    console.error('Error getting tipos documento:', error);
    res.status(500).json({ error: 'Failed to get tipos documento' });
  }
};