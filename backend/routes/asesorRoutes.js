import express from 'express';
import { createAsesor, updateAsesor, getAllAsesors } from '../controllers/asesorController.js';

const router = express.Router();

router.get('/', getAllAsesors);
router.post('/', createAsesor);
router.put('/:id', updateAsesor);

export default router;
