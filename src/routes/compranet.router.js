import { Router } from 'express';
import * as ctrl from '../controllers/compranet.controller.js';
import compranetRouter from './compranet.router.js';

const router = Router();

// Define la ruta: GET /api/v1/compranet/historico?buscar=...
router.get('/historico', ctrl.buscarHistorico);


export default router;