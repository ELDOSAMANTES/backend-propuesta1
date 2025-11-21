// src/controllers/requisicion.controller.js
import RequisicionService from '../services/requisicion.service.js';

const service = new RequisicionService();

export async function create(req, res, next) {
  try {
    const { usuario_id, solicitante_id, area_id } = req.body;
    if (!(usuario_id || solicitante_id) || !area_id) {
      return res.status(400).json({
        message: 'usuario_id (o solicitante_id) y area_id son obligatorios'
      });
    }
    const data = await service.create(req.body);
    res.status(201).json(data);
  } catch (e) {
    next(e);
  }
}

export async function list(req, res, next) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const data = await service.findAll({ page, limit });
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json(data);
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const data = await service.remove(req.params.id);
    res.json(data);
  } catch (e) {
    next(e);
  }
}
