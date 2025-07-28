import * as inmuebleService from '../services/inmuebleService.js';
import fs from 'fs';
import path from 'path';
import pool from '../db.js';
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
 * Controlador para obtener tipos de características.
 */
export const getTipoCaracteristicas = async (req, res) => {
  try {
    const tipos = await inmuebleService.getTipoCaracteristicas();
    res.json(tipos);
  } catch (error) {
    console.error('Error getting tipoCaracteristicas:', error);
    res.status(500).json({ error: 'Failed to get tipoCaracteristicas' });
  }
};

// New controller for searching inmuebles with filters
export const searchInmuebles = async (req, res) => {
  try {
    const filters = {
      q: req.query.q || null,
      propertyType: req.query.propertyType || null,
      transactionType: req.query.transactionType || null,
      bedrooms: req.query.bedrooms || null,
      bathrooms: req.query.bathrooms || null,
      minPrice: req.query.minPrice || null,
      maxPrice: req.query.maxPrice || null,
      limit: req.query.limit ? parseInt(req.query.limit) : 20,
      offset: req.query.offset ? parseInt(req.query.offset) : 0,
    };
    const inmuebles = await inmuebleService.searchInmuebles(filters);
    res.json(inmuebles);
  } catch (error) {
    console.error('Error searching inmuebles:', error);
    res.status(500).json({ error: 'Failed to search inmuebles' });
  }
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
    const ciudadId = parseInt(req.params.ciudadId);
    
    if (isNaN(ciudadId)) {
      return res.status(400).json({ error: 'ID de ciudad inválido' });
    }

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
 * Controlador para crear una nueva característica.
 */
export const createCaracteristica = async (req, res) => {
  try {
    const caracteristicaData = req.body;
    const newCaracteristica = await inmuebleService.createCaracteristica(caracteristicaData);
    res.status(201).json(newCaracteristica);
  } catch (error) {
    console.error('Error creating caracteristica:', error);
    res.status(500).json({ error: 'Failed to create caracteristica' });
  }
};

/**
 * Controlador para actualizar una característica existente.
 */
export const updateCaracteristica = async (req, res) => {
  try {
    const caracteristicaId = req.params.id;
    const caracteristicaData = req.body;
    const updatedCaracteristica = await inmuebleService.updateCaracteristica(caracteristicaId, caracteristicaData);
    res.json(updatedCaracteristica);
  } catch (error) {
    console.error('Error updating caracteristica:', error);
    res.status(500).json({ error: 'Failed to update caracteristica' });
  }
};

export const getCaracteristicaById = async (req, res) => {
  try {
    const caracteristicaId = req.params.id;
    const caracteristica = await inmuebleService.getCaracteristicaById(caracteristicaId);
    if (!caracteristica) {
      return res.status(404).json({ error: 'Característica no encontrada' });
    }
    res.json(caracteristica);
  } catch (error) {
    console.error('Error getting caracteristica by id:', error);
    res.status(500).json({ error: 'Failed to get caracteristica by id' });
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

/**
 * Obtiene todos los datos necesarios para modificar/ver un inmueble,
 * incluyendo datos del inmueble si se proporciona un inmuebleId.
 * @param {number|null} inmuebleId - ID del inmueble a obtener (opcional).
 * @returns {Object} - Datos agregados para modificar/ver inmueble.
 */
import { getNewestInmuebles } from '../services/inmuebleService.js';

export const getNewestInmueblesController = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const inmuebles = await getNewestInmuebles(limit);
    console.log('Fetched newest inmuebles:', inmuebles);
    res.json(inmuebles);
  } catch (error) {
    console.error('Error getting newest inmuebles:', error);
    res.status(500).json({ error: 'Failed to get newest inmuebles' });
  }
};

export const getModificarInmuebleData = async (req, res) => {
  try {
    const inmuebleId = req.params.id ? parseInt(req.params.id) : null;
    const data = await inmuebleService.getAllModificarInmuebleData(inmuebleId);
    res.json(data);
  } catch (error) {
    console.error('Error getting modificar inmueble data:', error);
    res.status(500).json({ error: 'Failed to get modificar inmueble data' });
  }
};

export const getZonaById = async (req, res) => {
  try {
    const zonaId = parseInt(req.params.zonaId);
    if (isNaN(zonaId)) {
      return res.status(400).json({ error: 'ID de zona inválido' });
    }
    const zona = await inmuebleService.getZonaById(zonaId);
    if (!zona) {
      return res.status(404).json({ error: 'Zona no encontrada' });
    }
    // Return enhanced zona data including ciudad and estado info
    res.json({
      id: zona.id,
      nombre: zona.nombre,
      ciudad_id: zona.ciudad_id,
      ciudad_nombre: zona.ciudad_nombre,
      estado_id: zona.estado_id,
      estado_nombre: zona.estado_nombre,
      codigo_postal: zona.codigo_postal
    });
  } catch (error) {
    console.error('Error getting zona by id:', error);
    res.status(500).json({ error: 'Failed to get zona by id' });
  }
};

/**
 * Controlador para actualizar un inmueble existente.
 */
export const updateInmueble = async (req, res) => {
  try {
    const inmuebleId = req.params.id;
    const inmuebleData = req.body;

    // Asignar subidoPor si no existe
    if (inmuebleData.imagenes && Array.isArray(inmuebleData.imagenes)) {
      inmuebleData.imagenes = inmuebleData.imagenes.map(img => ({
        ...img,
        subidoPor: img.subidoPor || (req.user ? req.user.id : null)
      }));
    }
    if (inmuebleData.documentos && Array.isArray(inmuebleData.documentos)) {
      inmuebleData.documentos = inmuebleData.documentos.map(doc => ({
        ...doc,
        subidoPor: doc.subidoPor || (req.user ? req.user.id : null)
      }));
    }

    const updatedInmueble = await inmuebleService.updateInmueble(inmuebleId, inmuebleData);
    res.json(updatedInmueble);
  } catch (error) {
    console.error('Error updating inmueble:', error);
    
    // Eliminar archivos subidos en caso de error
    if (req.body) {
      const imagenes = req.body.imagenes || [];
      const documentos = req.body.documentos || [];
      const filePathsToDelete = [];

      imagenes.forEach(img => {
        if (img.ruta && img.isNew) { // Solo eliminar imágenes nuevas
          filePathsToDelete.push(img.ruta);
        }
      });
      documentos.forEach(doc => {
        if (doc.ruta && doc.isNew) { // Solo eliminar documentos nuevos
          filePathsToDelete.push(doc.ruta);
        }
      });

      if (filePathsToDelete.length > 0) {
        deleteFiles(filePathsToDelete);
      }
    }

    res.status(500).json({ error: 'Failed to update inmueble' });
  }
};

/**
 * Controlador para obtener propiedades asignadas a un asesor.
 */


export const getPropertiesByAsesor = async (req, res) => {
  const usuarioId = req.params.id;
  console.log('getPropertiesByAsesor called with usuarioId:', usuarioId);
  if (!usuarioId) {
    return res.status(400).json({ error: 'Usuario ID is required' });
  }
  try {
    // Get asesor_id from Usuario table
    const usuarioResult = await pool.query('SELECT asesor_id FROM "Usuario" WHERE id = $1', [usuarioId]);
    if (usuarioResult.rowCount === 0) {
      return res.status(404).json({ error: 'Usuario not found' });
    }
    const asesorId = usuarioResult.rows[0].asesor_id;
    console.log(`Mapped usuarioId ${usuarioId} to asesorId ${asesorId}`);

    const properties = await inmuebleService.getPropertiesByAsesor(asesorId);
    console.log(`Found ${properties.length} properties for asesorId ${asesorId}`);

    // Map properties to match the structure returned by searchInmuebles for consistency
    const mappedProperties = properties.map(i => ({
      id: i.id,
      name: i.name,
      status: i.status,
      businesstypes: i.businesstypes || [],
      location: i.location || '',
      price: i.price || null,
      size: i.size,
      rooms: i.rooms,
      bathrooms: i.bathrooms,
      imageurl: i.imageurl || null,
      detailslink: i.detailslink
    }));
    res.json(mappedProperties);
  } catch (error) {
    console.error('Error getting properties by asesor:', error);
    res.status(500).json({ error: 'Failed to get properties by asesor' });
  }
};

