import express from 'express';
import { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario, login } from '../controllers/usuarioController.js';

const router = express.Router();

router.get('/', getAllUsuarios);
router.get('/:id', getUsuarioById);
router.post('/', createUsuario);
router.put('/:id', updateUsuario);
router.delete('/:id', deleteUsuario);
router.post('/login', login);

export default router;