import express from 'express';
import { createAsesor, updateAsesor } from '../controllers/asesorController.js';

const router = express.Router();

router.post('/', createAsesor);
router.put('/:id', updateAsesor);

export default router;
