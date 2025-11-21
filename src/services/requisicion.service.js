// src/services/requisicion.service.js
import { sequelize, models } from '../libs/sequelize.js';

const {
  Requisicion, Partida, Anexo, Historial, Usuario, Area,
  InvestigacionMercado, FuenteInvestigacion
} = models;

export default class RequisicionService {
  async create(payload) {
    return await sequelize.transaction(async (t) => {
      // Mapeo y defaults
      const usuario_id = payload.usuario_id ?? payload.solicitante_id ?? null;
      const area_id = payload.area_id ?? null;
      const folio = payload.folio ?? `REQ-${new Date().getFullYear()}-${Date.now().toString().slice(-4)}`;
      const fecha_elaboracion = payload.fecha_elaboracion ?? new Date().toISOString().slice(0,10);
      const tipo_contratacion = payload.tipo_contratacion ?? 'Sin definir';
      const programa_proyecto = payload.programa_proyecto ?? 'No especificado';
      const justificacion = payload.justificacion ?? 'Sin justificación';
      const estatus = payload.estatus ?? 'CREADA';

      if (!usuario_id || !area_id) {
        const err = new Error('usuario_id (o solicitante_id) y area_id son obligatorios');
        err.status = 400;
        throw err;
      }

      const req = await Requisicion.create({
        folio,
        fecha_elaboracion,
        usuario_id,
        area_id,
        tipo_contratacion,
        programa_proyecto,
        justificacion,
        estatus,
      }, { transaction: t });

      // Partidas
      if (Array.isArray(payload.partidas)) {
        for (const p of payload.partidas) {
          const importe = (Number(p.cantidad ?? 0) * Number(p.precio_unitario ?? 0)).toFixed(2);
          await Partida.create({ ...p, importe, requisicion_id: req.id }, { transaction: t });
        }
      }

      // Anexos
      if (Array.isArray(payload.anexos)) {
        for (const a of payload.anexos) {
          await Anexo.create({ ...a, requisicion_id: req.id }, { transaction: t });
        }
      }

      // Historial
      if (Array.isArray(payload.historial)) {
        for (const h of payload.historial) {
          await Historial.create({ ...h, requisicion_id: req.id }, { transaction: t });
        }
      }

      // Investigación de mercado
      if (payload.investigacion) {
        const { proveedor_seleccionado, razon_seleccion, fuentes = [] } = payload.investigacion;
        const inv = await InvestigacionMercado.create({
          requisicion_id: req.id,
          proveedor_seleccionado,
          razon_seleccion
        }, { transaction: t });

        for (const f of fuentes) {
          await FuenteInvestigacion.create({
            investigacion_id: inv.id,
            nombre_fuente: f.nombre_fuente
          }, { transaction: t });
        }
      }

      return req;
    });
  }

  async findAll({ page = 1, limit = 20 } = {}) {
    const offset = (page - 1) * limit;
    const { rows, count } = await Requisicion.findAndCountAll({
      offset, limit,
      order: [['created_at', 'DESC']],
      distinct: true,
      include: [
        { model: Usuario, as: 'solicitante', attributes: ['id', 'nombre', 'email'] },
        { model: Area, attributes: ['id', 'nombre'] },
      ],
    });
    return { total: count, page, limit, data: rows };
  }

  async findById(id) {
    const req = await Requisicion.findByPk(id, {
      include: [
        { model: Usuario, as: 'solicitante', attributes: ['id', 'nombre', 'email'] },
        { model: Area, attributes: ['id', 'nombre'] },
        { model: Partida },
        { model: Anexo },
        { model: Historial, include: [{ model: Usuario, attributes: ['id', 'nombre'] }] },
        { model: InvestigacionMercado, include: [{ model: FuenteInvestigacion }] },
      ],
    });
    if (!req) {
      const err = new Error('Requisición no encontrada');
      err.status = 404;
      throw err;
    }
    return req;
  }

  async update(id, changes) {
    return await sequelize.transaction(async (t) => {
      const req = await Requisicion.findByPk(id, { transaction: t });
      if (!req) {
        const err = new Error('Requisición no encontrada');
        err.status = 404;
        throw err;
      }

      const usuario_id = changes.usuario_id ?? changes.solicitante_id ?? req.usuario_id;
      const updatable = {
        folio: changes.folio ?? req.folio,
        fecha_elaboracion: changes.fecha_elaboracion ?? req.fecha_elaboracion,
        usuario_id,
        area_id: changes.area_id ?? req.area_id,
        tipo_contratacion: changes.tipo_contratacion ?? req.tipo_contratacion,
        programa_proyecto: changes.programa_proyecto ?? req.programa_proyecto,
        justificacion: changes.justificacion ?? req.justificacion,
        estatus: changes.estatus ?? req.estatus,
        partida_id: changes.partida_id ?? req.partida_id,
        lugar_entrega: changes.lugar_entrega ?? req.lugar_entrega,
      };

      await req.update(updatable, { transaction: t });
      return await this.findById(id);
    });
  }

  async remove(id) {
    return await sequelize.transaction(async (t) => {
      const req = await Requisicion.findByPk(id, { transaction: t });
      if (!req) {
        const err = new Error('Requisición no encontrada');
        err.status = 404;
        throw err;
      }
      await req.destroy({ transaction: t });
      return { id };
    });
  }
}
