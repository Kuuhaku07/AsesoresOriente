import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { validateRequest } from '../middlewares/validationMiddleware.js';
import {
  getRedesAsesor,
  getRedesAsesorByUserId,
  createRedAsesor,
  updateRedAsesor,
  deleteRedAsesor
} from '../controllers/redesAsesorController.js';

const router = express.Router();

// Get all redes for current asesor
router.get('/', authenticateToken, getRedesAsesor);

// Get redes for asesor by user id (public)
router.get('/user/:userId', getRedesAsesorByUserId);

// Create new red asesor
router.post(
  '/',
  authenticateToken,
  [
    body('red_social_id').isInt().withMessage('red_social_id debe ser un entero'),
    body('url').optional().isString(),
    body('identifier').optional().isString(),
    body().custom(body => {
      if (!body.url && !body.identifier) {
        throw new Error('Debe proporcionar url o identificador');
      }
      return true;
    })
  ],
  validateRequest,
  createRedAsesor
);

// Update red asesor by id
router.put(
  '/:id',
  authenticateToken,
  [
    body('red_social_id').isInt().withMessage('red_social_id debe ser un entero'),
    body('url').optional().isString(),
    body('identifier').optional().isString(),
    body().custom(body => {
      if (!body.url && !body.identifier) {
        throw new Error('Debe proporcionar url o identificador');
      }
      return true;
    })
  ],
  validateRequest,
  updateRedAsesor
);

// Delete red asesor by id
router.delete('/:id', authenticateToken, deleteRedAsesor);

export default router;
