import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class FuenteInvestigacion extends Model {}
  FuenteInvestigacion.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre_fuente: { type: DataTypes.STRING(180), allowNull: false },
  }, {
    sequelize,
    tableName: 'fuentes_investigacion',
    modelName: 'FuenteInvestigacion',
  });
  return FuenteInvestigacion;
};
