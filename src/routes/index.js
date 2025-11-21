// src/routes/index.js
import express from 'express';
import requisicionRouter from './requisicion.router.js';
import cucopRouter from './cucop.router.js';
// 1. IMPORTA TU NUEVO ROUTER
import compranetRouter from './compranet.router.js'; 

// Define la función que configura todas las rutas de la API v1
export default function routerApi(app) {
  // Crea un router específico para la versión v1
  const router = express.Router();
  // Monta este router bajo el prefijo /api/v1 en la aplicación Express
  app.use('/api/v1', router);

  // Define las rutas que colgarán de /api/v1
  router.use('/requisiciones', requisicionRouter); // Rutas para /api/v1/requisiciones/...
  router.use('/cucop', cucopRouter);           // Rutas para /api/v1/cucop/...

  // 2. USA TU NUEVO ROUTER
  router.use('/compranet', compranetRouter);   // Rutas para /api/v1/compranet/...
}