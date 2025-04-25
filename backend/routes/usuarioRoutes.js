import express from 'express';
import { body } from 'express-validator';
import { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario, login } from '../controllers/usuarioController.js';
import { validateRequest } from '../middlewares/validationMiddleware.js';
import { loginRateLimiter } from '../middlewares/rateLimitMiddleware.js';

/**
 * Rutas para la gestión de usuarios.
 * Incluye validación de datos y limitación de intentos de login.
 */
const router = express.Router();

router.get('/', getAllUsuarios);
router.get('/:id', getUsuarioById);

/**
 * Ruta para crear un nuevo usuario.
 * Valida que el correo sea un email válido,
 * la contraseña tenga al menos 6 caracteres,
 * id_asesor sea un entero y rol no esté vacío.
 */
router.post(
  '/',
  [
    body('Correo').isEmail().withMessage('Correo debe ser un email valido'),
    body('Contraseña').isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
    body('id_asesor').isInt().withMessage('id_asesor debe ser un entero'),
    body('Rol').notEmpty().withMessage('Rol es requerido')
  ],
  validateRequest,
  createUsuario
);

/**
 * Ruta para actualizar un usuario existente.
 * Valida los campos opcionales con las mismas reglas que la creación.
 */
router.put(
  '/:id',
  [
    body('Correo').optional().isEmail().withMessage('Correo debe ser un email valido'),
    body('Contraseña').optional().isLength({ min: 6 }).withMessage('Contraseña debe tener al menos 6 caracteres'),
    body('id_asesor').optional().isInt().withMessage('id_asesor debe ser un entero'),
    body('Rol').optional().notEmpty().withMessage('Rol es requerido')
  ],
  validateRequest,
  updateUsuario
);

/**
 * Ruta para eliminar un usuario por ID.
 */
router.delete('/:id', deleteUsuario);

/**
 * Ruta para login de usuario.
 * Aplica limitación de intentos para prevenir fuerza bruta.
 * Valida que el correo sea un email válido y la contraseña no esté vacía.
 */
router.post(
  '/login',
  loginRateLimiter,
  [
    body('Correo').isEmail().withMessage('Correo debe ser un email valido'),
    body('Contraseña').notEmpty().withMessage('Contraseña es requerido')
  ],
  validateRequest,
  login
);

export default router;
