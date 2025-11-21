// src/routes/usuario.router.js
import { Router } from 'express';
import { getPerfil } from '../controllers/usuario.controller.js';

const router = Router();

// GET /api/v1/perfil
router.get('/', getPerfil);

export default router;