import { sequelize, models } from '../libs/sequelize.js';

const {
  Requisicion, Partida, Anexo, Historial, Usuario, Area,
  InvestigacionMercado, FuenteInvestigacion
} = models;

export default class RequisicionService {
  async create(payload) {
    return await sequelize.transaction(async (t) => {
      const {
        folio, fecha_elaboracion, usuario_id, area_id, tipo_contratacion,
        programa_proyecto, justificacion, estatus,
        partidas = [], anexos = [], historial = [], investigacion = null
      } = payload;

      const req = await Requisicion.create({
        folio, fecha_elaboracion, usuario_id, area_id, tipo_contratacion,
        programa_proyecto, justificacion, estatus
      }, { transaction: t });

      // Partidas
      for (const p of partidas) {
        const importe = (Number(p.cantidad ?? 0) * Number(p.precio_unitario ?? 0)).toFixed(2);
        await Partida.create({ ...p, importe, requisicion_id: req.id }, { transaction: t });
      }

      // Anexos
      for (const a of anexos) {
        await Anexo.create({ ...a, requisicion_id: req.id }, { transaction: t });
      }

      // Historial
      for (const h of historial) {
        await Historial.create({ ...h, requisicion_id: req.id }, { transaction: t });
      }

      // Investigación de mercado
      if (investigacion) {
        const { proveedor_seleccionado, razon_seleccion, fuentes = [] } = investigacion;
        const inv = await InvestigacionMercado.create({
          requisicion_id: req.id, proveedor_seleccionado, razon_seleccion
        }, { transaction: t });

        for (const f of fuentes) {
          await FuenteInvestigacion.create({
            investigacion_id: inv.id, nombre_fuente: f.nombre_fuente
          }, { transaction: t });
        }
      }

      return req;
    });
  }

  async findAll({ page = 1, limit = 20 }) {
    const offset = (page - 1) * limit;
    const rows = await Requisicion.findAndCountAll({
      offset, limit,
      order: [['created_at', 'DESC']],
      include: [
        { model: Usuario, attributes: ['id', 'nombre', 'email'] },
        { model: Area, attributes: ['id', 'nombre'] },
      ]
    });
    return {
      total: rows.count,
      page, limit,
      data: rows.rows
    };
  }

  async findById(id) {
    const req = await Requisicion.findByPk(id, {
      include: [
        { model: Usuario, attributes: ['id', 'nombre', 'email'] },
        { model: Area, attributes: ['id', 'nombre'] },
        { model: Partida },
        { model: Anexo },
        { model: Historial, include: [{ model: Usuario, attributes: ['id', 'nombre'] }] },
        { model: InvestigacionMercado, include: [ { model: FuenteInvestigacion } ] },
      ]
    });
    if (!req) throw new Error('Requisición no encontrada');
    return req;
  }

  async update(id, changes) {
    return await sequelize.transaction(async (t) => {
      const req = await Requisicion.findByPk(id, { transaction: t });
      if (!req) throw new Error('Requisición no encontrada');
      const updatable = (({ folio, fecha_elaboracion, usuario_id, area_id, tipo_contratacion, programa_proyecto, justificacion, estatus }) =>
        ({ folio, fecha_elaboracion, usuario_id, area_id, tipo_contratacion, programa_proyecto, justificacion, estatus }))(changes);
      await req.update(updatable, { transaction: t });

      if (Array.isArray(changes.partidas)) {
        await Partida.destroy({ where: { requisicion_id: id }, transaction: t });
        for (const p of changes.partidas) {
          const importe = (Number(p.cantidad ?? 0) * Number(p.precio_unitario ?? 0)).toFixed(2);
          await Partida.create({ ...p, importe, requisicion_id: id }, { transaction: t });
        }
      }

      if (Array.isArray(changes.anexos)) {
        await Anexo.destroy({ where: { requisicion_id: id }, transaction: t });
        for (const a of changes.anexos) {
          await Anexo.create({ ...a, requisicion_id: id }, { transaction: t });
        }
      }

      if (Array.isArray(changes.historial)) {
        for (const h of changes.historial) {
          await Historial.create({ ...h, requisicion_id: id }, { transaction: t });
        }
      }

      if (changes.investigacion) {
        const { proveedor_seleccionado, razon_seleccion, fuentes = [] } = changes.investigacion;
        const prev = await InvestigacionMercado.findOne({ where: { requisicion_id: id }, transaction: t });
        if (prev) {
          await prev.update({ proveedor_seleccionado, razon_seleccion }, { transaction: t });
          await FuenteInvestigacion.destroy({ where: { investigacion_id: prev.id }, transaction: t });
          for (const f of fuentes) {
            await FuenteInvestigacion.create({ investigacion_id: prev.id, nombre_fuente: f.nombre_fuente }, { transaction: t });
          }
        } else {
          const inv = await InvestigacionMercado.create({ requisicion_id: id, proveedor_seleccionado, razon_seleccion }, { transaction: t });
          for (const f of fuentes) {
            await FuenteInvestigacion.create({ investigacion_id: inv.id, nombre_fuente: f.nombre_fuente }, { transaction: t });
          }
        }
      }

      return await this.findById(id);
    });
  }

  async remove(id) {
    return await sequelize.transaction(async (t) => {
      const req = await Requisicion.findByPk(id, { transaction: t });
      if (!req) throw new Error('Requisición no encontrada');
      await req.destroy({ transaction: t });
      return { id };
    });
  }
}
