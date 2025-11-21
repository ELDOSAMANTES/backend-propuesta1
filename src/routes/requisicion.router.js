// src/routes/requisicion.router.js
import { Router } from 'express';
import { create, list, getById, update, remove } from '../controllers/requisicion.controller.js';

const router = Router();
router.get('/', list);
router.get('/:id', getById);
router.post('/', create);  // <= necesario para tu POST
router.put('/:id', update);
router.delete('/:id', remove);
export default router;
