import express from 'express';
import { getAllRedesSociales } from '../controllers/redesSocialController.js';

const router = express.Router();

router.get('/', getAllRedesSociales);

export default router;
