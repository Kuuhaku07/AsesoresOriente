import express from 'express';
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
  getCaracteristicas
} from '../controllers/inmuebleController.js';

const router = express.Router();

router.post('/', createInmueble);

router.get('/tipos', getTipoInmuebles);
router.get('/estados', getEstadoInmuebles);
router.get('/asesores', getAsesores);
router.get('/propietarios/persona', getPropietariosPersona);
router.get('/propietarios/empresa', getPropietariosEmpresa);
router.get('/ubicacion/estados', getEstados);
router.get('/ubicacion/ciudades/:estadoId', getCiudades);
router.get('/ubicacion/zonas/:ciudadId', getZonas);
router.get('/tiponegocios', getTipoNegocios);
router.get('/caracteristicas', getCaracteristicas);

export default router;
