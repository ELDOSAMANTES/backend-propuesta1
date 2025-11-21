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
    
    // ✅ CORRECCIÓN: Envolvemos en 'data'
    res.status(201).json({ 
      message: 'Requisición creada con éxito',
      data 
    });
  } catch (e) {
    next(e);
  }
}

export async function list(req, res, next) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 20);
    const result = await service.findAll({ page, limit });
    
    // ✅ CORRECCIÓN: Envolvemos el resultado
    // result es { total, data: [] }, así que al envolverlo, 
    // el frontend recibirá response.data.data.total correctamente
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
}

export async function getById(req, res, next) {
  try {
    const data = await service.findById(req.params.id);
    
    // ✅ CORRECCIÓN: Esto es lo que arregla tu error actual ("No se puede cargar")
    res.json({ data });
  } catch (e) {
    next(e);
  }
}

export async function update(req, res, next) {
  try {
    const data = await service.update(req.params.id, req.body);
    
    // ✅ CORRECCIÓN: Envolvemos para futuras ediciones
    res.json({ 
      message: 'Requisición actualizada',
      data 
    });
  } catch (e) {
    next(e);
  }
}

export async function remove(req, res, next) {
  try {
    const data = await service.remove(req.params.id);
    
    // ✅ CORRECCIÓN: Envolvemos para eliminaciones
    res.json({ 
      message: 'Requisición eliminada',
      data 
    });
  } catch (e) {
    next(e);
  }
}