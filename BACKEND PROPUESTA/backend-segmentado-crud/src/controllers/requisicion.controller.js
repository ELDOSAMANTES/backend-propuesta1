import RequisicionService from '../services/requisicion.service.js';

const service = new RequisicionService();

export async function create(req, res, next) {
  try {
    const data = await service.create(req.body);
    res.status(201).json({ message: 'Requisición creada', data });
  } catch (err) {
    next(err);
  }
}

export async function list(req, res, next) {
  try {
    const page = parseInt(req.query.page ?? '1', 10);
    const limit = parseInt(req.query.limit ?? '20', 10);
    const data = await service.findAll({ page, limit });
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    res.json(data);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body);
    res.json({ message: 'Requisición actualizada', data });
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const data = await service.remove(req.params.id);
    res.json({ message: 'Requisición eliminada', data });
  } catch (err) {
    next(err);
  }
}
