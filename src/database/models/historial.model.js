import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Historial extends Model {}

  Historial.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    requisicion_id: { type: DataTypes.INTEGER, allowNull: false },
    usuario_id: { type: DataTypes.INTEGER, allowNull: false },
    accion: { type: DataTypes.STRING(100), allowNull: false },
    fecha_accion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  }, {
    sequelize,
    tableName: 'historial',
    modelName: 'Historial',
    timestamps: false,
  });

  return Historial;
};
