import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Historial extends Model {}
  Historial.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    accion: { type: DataTypes.TEXT, allowNull: false },
    fecha: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  }, {
    sequelize,
    tableName: 'historiales',
    modelName: 'Historial',
  });
  return Historial;
};
