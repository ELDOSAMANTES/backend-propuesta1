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

      // Validaciones básicas
      if (!usuario_id || !area_id) {
        const err = new Error('usuario_id (o solicitante_id) y area_id son obligatorios');
        err.status = 400;
        throw err;
      }

      // 1. Crear Requisición (Encabezado)
      const req = await Requisicion.create({
        folio,
        fecha_elaboracion,
        usuario_id,
        area_id,
        tipo_contratacion,
        programa_proyecto,
        justificacion,
        estatus,
        oficio_autorizacion: payload.oficio_autorizacion,
        partida_presupuestal: payload.partida_presupuestal,
        lugar_entrega: payload.lugar_entrega,
        fecha_entrega: payload.fecha_entrega,
        plazo_condiciones_pago: payload.plazo_condiciones_pago,
      }, { transaction: t });

      // 2. Crear Partidas
      if (Array.isArray(payload.partidas)) {
        for (const p of payload.partidas) {
          const importe = (Number(p.cantidad ?? 0) * Number(p.precio_unitario ?? 0)).toFixed(2);
          await Partida.create({ ...p, importe, requisicion_id: req.id }, { transaction: t });
        }
      }

      // 3. Crear Anexos
      if (Array.isArray(payload.anexos)) {
        for (const a of payload.anexos) {
          await Anexo.create({ ...a, requisicion_id: req.id }, { transaction: t });
        }
      }

      // 4. Crear Historial (Inicial)
      await Historial.create({
        requisicion_id: req.id,
        usuario_id,
        accion: 'Requisición Creada',
        observaciones: 'Registro inicial del sistema'
      }, { transaction: t });


      // 5. Crear Investigación de Mercado (Ganador y Fuentes)
      if (payload.investigacion) {
        const { proveedor_seleccionado, razon_seleccion, fuentes = [] } = payload.investigacion;
        
        // a) Guardar el encabezado (Ganador y Razón)
        const inv = await InvestigacionMercado.create({
          requisicion_id: req.id,
          proveedor_seleccionado,
          razon_seleccion
        }, { transaction: t });

        // b) Guardar las fuentes con TODOS los detalles de Compranet/Internet
        for (const f of fuentes) {
          
          // Limpieza de Tipos: Asegura que los campos NUMERIC y DATE no sean cadenas vacías
          const precio = Number(f.precio_unitario) > 0 ? Number(f.precio_unitario) : 0;
          const fechaRef = f.fecha_referencia && f.fecha_referencia.trim() !== '' ? f.fecha_referencia : null;

          await FuenteInvestigacion.create({
            investigacion_id: inv.id,
            nombre_fuente: f.nombre_fuente,
            tipo_fuente: f.tipo_fuente || 'OTRO',
            url_fuente: f.url_fuente,
            
            // DATOS RICOS DE COMPRANET
            precio_unitario: precio, 
            numero_contrato: f.numero_contrato || null,
            fecha_referencia: fechaRef, 
            descripcion_bien: f.descripcion_bien || null
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
        
        // Incluimos Investigación Y SUS FUENTES (Para la vista de detalle)
        { 
          model: InvestigacionMercado,
          include: [
            { model: FuenteInvestigacion } 
          ]
        },
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
      await req.update({ ...changes, usuario_id }, { transaction: t });
      
      await Historial.create({
        requisicion_id: req.id,
        usuario_id,
        accion: 'Requisición Actualizada',
        observaciones: 'Edición de datos generales'
      }, { transaction: t });

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