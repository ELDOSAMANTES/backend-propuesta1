import AreaModel from './area.model.js';
import UsuarioModel from './usuario.model.js';
import RequisicionModel from './requisicion.model.js';
import PartidaModel from './partida.model.js';
import AnexoModel from './anexo.model.js';
import HistorialModel from './historial.model.js';
import InvestigacionMercadoModel from './investigacionMercado.model.js';
import FuenteInvestigacionModel from './fuenteInvestigacion.model.js';

export default function initModels(sequelize) {
  const Area = AreaModel(sequelize);
  const Usuario = UsuarioModel(sequelize);
  const Requisicion = RequisicionModel(sequelize);
  const Partida = PartidaModel(sequelize);
  const Anexo = AnexoModel(sequelize);
  const Historial = HistorialModel(sequelize);
  const InvestigacionMercado = InvestigacionMercadoModel(sequelize);
  const FuenteInvestigacion = FuenteInvestigacionModel(sequelize);

  // Relaciones
  Area.hasMany(Usuario, { foreignKey: { name: 'area_id', allowNull: true }, onDelete: 'SET NULL' });
  Usuario.belongsTo(Area, { foreignKey: { name: 'area_id', allowNull: true } });

  Area.hasMany(Requisicion, { foreignKey: { name: 'area_id', allowNull: false }, onDelete: 'RESTRICT' });
  Requisicion.belongsTo(Area, { foreignKey: { name: 'area_id', allowNull: false } });

  Usuario.hasMany(Requisicion, { foreignKey: { name: 'usuario_id', allowNull: false }, onDelete: 'RESTRICT' });
  Requisicion.belongsTo(Usuario, { foreignKey: { name: 'usuario_id', allowNull: false } });

  Requisicion.hasMany(Partida, { foreignKey: { name: 'requisicion_id', allowNull: false }, onDelete: 'CASCADE' });
  Partida.belongsTo(Requisicion, { foreignKey: { name: 'requisicion_id', allowNull: false } });

  Requisicion.hasMany(Anexo, { foreignKey: { name: 'requisicion_id', allowNull: false }, onDelete: 'CASCADE' });
  Anexo.belongsTo(Requisicion, { foreignKey: { name: 'requisicion_id', allowNull: false } });

  Requisicion.hasMany(Historial, { foreignKey: { name: 'requisicion_id', allowNull: false }, onDelete: 'CASCADE' });
  Historial.belongsTo(Requisicion, { foreignKey: { name: 'requisicion_id', allowNull: false } });
  Usuario.hasMany(Historial, { foreignKey: { name: 'usuario_id', allowNull: false }, onDelete: 'RESTRICT' });
  Historial.belongsTo(Usuario, { foreignKey: { name: 'usuario_id', allowNull: false } });

  Requisicion.hasOne(InvestigacionMercado, { foreignKey: { name: 'requisicion_id', allowNull: false }, onDelete: 'CASCADE' });
  InvestigacionMercado.belongsTo(Requisicion, { foreignKey: { name: 'requisicion_id', allowNull: false } });

  InvestigacionMercado.hasMany(FuenteInvestigacion, { foreignKey: { name: 'investigacion_id', allowNull: false }, onDelete: 'CASCADE' });
  FuenteInvestigacion.belongsTo(InvestigacionMercado, { foreignKey: { name: 'investigacion_id', allowNull: false } });

  return { Area, Usuario, Requisicion, Partida, Anexo, Historial, InvestigacionMercado, FuenteInvestigacion };
}
