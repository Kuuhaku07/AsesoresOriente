import express from 'express';
import multer from 'multer';
import path from 'path';
import {
  createInmueble,
  getTipoInmuebles,
  getEstadoInmuebles,
  getAsesores,
  getPropietariosPersona,
  getPropietariosEmpresa,
  getEstados,
  getCiudades,
  getZonas,
  getTipoNegocios,
  getCaracteristicas,
  getCaracteristicaById,
  createCaracteristica,
  updateCaracteristica,
  createPropietarioPersona,
  updatePropietarioPersona,
  createPropietarioEmpresa,
  updatePropietarioEmpresa,
  getEstadoCivil,
  getTiposDocumento,
  uploadInmuebleImage,
  uploadInmuebleDocument,
  getModificarInmuebleData,
  getZonaById,
  updateInmueble,
  getTipoCaracteristicas,
  getNewestInmueblesController,
  searchInmuebles
} from '../controllers/inmuebleController.js';


// Configuración de multer para subir imágenes de inmuebles
const storageImages = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/inmuebles/images/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadImages = multer({
  storage: storageImages,
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes JPEG y PNG'));
  }
});

// Configuración de multer para subir documentos de inmuebles
const storageDocuments = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/inmuebles/documents/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadDocuments = multer({
  storage: storageDocuments,
  fileFilter: function (req, file, cb) {
    // Permitir tipos comunes de documentos
    const filetypes = /pdf|doc|docx|xls|xlsx|txt/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten documentos PDF, DOC, XLS, TXT'));
  }
});

const router = express.Router();

router.post('/', createInmueble);

// Ruta para subir imágenes de inmueble
router.post('/upload/image', uploadImages.array('images', 10), uploadInmuebleImage);

// Ruta para subir documentos de inmueble
import { multerErrorHandler } from '../middlewares/validationMiddleware.js';

router.post('/upload/document', uploadDocuments.array('documents', 10), uploadInmuebleDocument, multerErrorHandler);

router.get('/tipos', getTipoInmuebles);
router.get('/estados', getEstadoInmuebles);
router.get('/asesores', getAsesores);
router.get('/propietarios/persona', getPropietariosPersona);
router.get('/propietarios/empresa', getPropietariosEmpresa);
router.get('/ubicacion/estados', getEstados);
router.get('/ubicacion/ciudades/:estadoId', getCiudades);
router.get('/ubicacion/zonas/:ciudadId', getZonas);
router.get('/ubicacion/zona/:zonaId', getZonaById);
router.get('/tiponegocios', getTipoNegocios);
router.get('/caracteristicas', getCaracteristicas);
router.get('/caracteristicas/:id', getCaracteristicaById);
router.post('/caracteristicas', createCaracteristica);
router.put('/caracteristicas/:id', updateCaracteristica);
router.post('/propietarios/persona', createPropietarioPersona);
router.put('/propietarios/persona/:id', updatePropietarioPersona);
router.post('/propietarios/empresa', createPropietarioEmpresa);
router.put('/propietarios/empresa/:id', updatePropietarioEmpresa);
router.get('/estadoCivil', getEstadoCivil);
router.get('/tiposdocumento', getTiposDocumento);
router.get('/modificar/:id?', getModificarInmuebleData);
router.get('/newest', getNewestInmueblesController);
router.get('/featured', getNewestInmueblesController);
router.get('/search', searchInmuebles);
router.put('/:id', updateInmueble);
export default router;
