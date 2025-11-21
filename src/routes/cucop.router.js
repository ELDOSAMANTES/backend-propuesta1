// src/routes/cucop.router.js
import express from 'express';
// Importa la CLASE del controlador por defecto
import CucopController from '../controllers/cucop.controller.js'; // Verifica la ruta

const router = express.Router();
// Crea una INSTANCIA de la clase del controlador
const ctrl = new CucopController();

// Define la ruta GET /buscar/:codigo que llama al método getByCodigo de la instancia
router.get('/buscar/:codigo', ctrl.getByCodigo);

// Exporta el router para que index.js lo pueda usar
export default router;