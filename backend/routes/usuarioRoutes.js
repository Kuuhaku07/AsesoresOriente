import express from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario, login, getCurrentUser, logout, refreshToken } from '../controllers/usuarioController.js';
import { validateRequest, multerErrorHandler } from '../middlewares/validationMiddleware.js';
import { loginRateLimiter } from '../middlewares/rateLimitMiddleware.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

/**
 * Configuración de multer para subir archivos de imagen
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/profile_pictures/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
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

/**
 * Rutas para la gestión de usuarios.
 * Incluye validación de datos y limitación de intentos de login.
 */
const router = express.Router();

// New route to get current user info
router.get('/me', authenticateToken, getCurrentUser);

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
 * Usa multer para subir archivo con campo 'pfp' y maneja errores de multer.
 */
router.put(
  '/:id',
  upload.single('pfp'), // Middleware para subir archivo con campo 'pfp'
  multerErrorHandler,   // Middleware para manejar errores de multer
  [
    body('Correo').optional({ nullable: true }).isEmail().withMessage('Correo debe ser un email valido'),
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
 * Valida que el identificador no esté vacío y la contraseña no esté vacía.
 */
router.post(
  '/login',
  loginRateLimiter,
  [
    body('identifier').notEmpty().withMessage('Identificador es requerido'),
    body('Contraseña').notEmpty().withMessage('Contraseña es requerida')
  ],
  validateRequest,
  login
);

router.post(
  '/logout',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token es requerido')
  ],
  validateRequest,
  logout
);

router.post(
  '/refresh-token',
  [
    body('refreshToken').notEmpty().withMessage('Refresh token es requerido')
  ],
  validateRequest,
  refreshToken
);

export default router;
