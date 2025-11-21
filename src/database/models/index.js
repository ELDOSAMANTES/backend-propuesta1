// src/database/models/index.js
import setupAnexo from './anexo.model.js';
import setupArea from './area.model.js';
import setupFuenteInvestigacion from './fuenteInvestigacion.model.js';
import setupHistorial from './historial.model.js';
import setupInvestigacionMercado from './investigacionMercado.model.js';
import setupPartida from './partida.model.js';
import setupRequisicion from './requisicion.model.js';
import setupUsuario from './usuario.model.js';
import setupCucop from './cucop.model.js'; // <-- AÑADIR importación

export function setupModels(sequelize) {
  const Anexo = setupAnexo(sequelize);
  const Area = setupArea(sequelize);
  const FuenteInvestigacion = setupFuenteInvestigacion(sequelize);
  const Historial = setupHistorial(sequelize);
  const InvestigacionMercado = setupInvestigacionMercado(sequelize);
  const Partida = setupPartida(sequelize);
  const Requisicion = setupRequisicion(sequelize);
  const Usuario = setupUsuario(sequelize);
  const Cucop = setupCucop(sequelize); // <-- AÑADIR inicialización

  // --- Relaciones ---

  // Área ↔ Usuario
  Area.hasMany(Usuario, { foreignKey: { name: 'area_id', allowNull: false } });
  Usuario.belongsTo(Area, { foreignKey: { name: 'area_id', allowNull: false } });

  // Área ↔ Requisición
  Area.hasMany(Requisicion, { foreignKey: { name: 'area_id', allowNull: false } });
  Requisicion.belongsTo(Area, { foreignKey: { name: 'area_id', allowNull: false } });

  // Usuario ↔ Requisición (alias 'solicitante', FK real usuario_id)
  Usuario.hasMany(Requisicion, {
    as: 'requisiciones',
    foreignKey: { name: 'usuario_id', allowNull: false },
  });
  Requisicion.belongsTo(Usuario, {
    as: 'solicitante',
    foreignKey: { name: 'usuario_id', allowNull: false },
  });

  // Requisición ↔ Partida (1:N)
  Requisicion.hasMany(Partida, { foreignKey: { name: 'requisicion_id', allowNull: false }, onDelete: 'CASCADE' });
  Partida.belongsTo(Requisicion, { foreignKey: { name: 'requisicion_id', allowNull: false } });

  // Requisición ↔ Anexo (1:N)
  Requisicion.hasMany(Anexo, { foreignKey: { name: 'requisicion_id', allowNull: false }, onDelete: 'CASCADE' });
  Anexo.belongsTo(Requisicion, { foreignKey: { name: 'requisicion_id', allowNull: false } });

  // Requisición ↔ Historial (1:N) y Usuario en historial
  Requisicion.hasMany(Historial, { foreignKey: { name: 'requisicion_id', allowNull: false }, onDelete: 'CASCADE' });
  Historial.belongsTo(Requisicion, { foreignKey: { name: 'requisicion_id', allowNull: false } });
  Historial.belongsTo(Usuario, { foreignKey: { name: 'usuario_id', allowNull: false } });

  // Requisición ↔ Investigación de mercado (1:1 o 1:N si se guarda historial)
  // Ajustado a hasOne basado en tu código anterior
  Requisicion.hasOne(InvestigacionMercado, { foreignKey: { name: 'requisicion_id', allowNull: false }, onDelete: 'CASCADE' });
  InvestigacionMercado.belongsTo(Requisicion, { foreignKey: { name: 'requisicion_id', allowNull: false } });

  // Investigación de mercado ↔ Fuentes (1:N)
  InvestigacionMercado.hasMany(FuenteInvestigacion, { foreignKey: { name: 'investigacion_id', allowNull: false }, onDelete: 'CASCADE' });
  FuenteInvestigacion.belongsTo(InvestigacionMercado, { foreignKey: { name: 'investigacion_id', allowNull: false } });

  // Modelo Cucop no tiene relaciones directas definidas aquí con otros modelos

  return {
    Anexo,
    Area,
    FuenteInvestigacion,
    Historial,
    InvestigacionMercado,
    Partida,
    Requisicion,
    Usuario,
    Cucop, // <-- AÑADIR al objeto exportado
  };
}