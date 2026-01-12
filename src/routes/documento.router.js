import { Router } from 'express';
import { generarPdf } from '../controllers/documento.controller.js';

const router = Router();

// Endpoint: POST http://localhost:3001/api/v1/documentos/generar
router.post('/generar', generarPdf);

export default router;