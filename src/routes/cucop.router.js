// src/routes/cucop.router.js
import express from 'express';
import { 
  getCapitulos, 
  getGenericas, 
  getEspecificas, 
  getProductos 
} from '../controllers/cucop.controller.js';

const router = express.Router();

// 1. Capítulos
router.get('/capitulos', getCapitulos);

// 2. Genéricas (Filtrado por Capítulo)
// IMPORTANTE: Fíjate que la URL incluye '/genericas' al final
router.get('/capitulo/:id/genericas', getGenericas);

// 3. Específicas (Filtrado por Genérica)
router.get('/generica/:id/especificas', getEspecificas);

// 4. Productos
router.get('/especifica/:id/productos', getProductos);

export default router;