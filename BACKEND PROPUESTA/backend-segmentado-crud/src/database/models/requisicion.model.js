import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Requisicion extends Model {}
  Requisicion.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    folio: { type: DataTypes.STRING(60), allowNull: false, unique: true },
    fecha_elaboracion: { type: DataTypes.DATEONLY, allowNull: false },
    tipo_contratacion: { type: DataTypes.STRING(80) },
    programa_proyecto: { type: DataTypes.STRING(160) },
    justificacion: { type: DataTypes.TEXT },
    estatus: { type: DataTypes.STRING(40), defaultValue: 'CREADA' },
  }, {
    sequelize,
    tableName: 'requisiciones',
    modelName: 'Requisicion',
  });
  return Requisicion;
};
