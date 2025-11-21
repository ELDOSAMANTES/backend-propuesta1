import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class FuenteInvestigacion extends Model {}

  FuenteInvestigacion.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre_fuente: { type: DataTypes.STRING(150), allowNull: false },
    url_fuente: { type: DataTypes.STRING(500), allowNull: true },
    tipo_fuente: { type: DataTypes.STRING(100), allowNull: true },
  }, {
    sequelize,
    tableName: 'fuentes_investigacion',
    modelName: 'FuenteInvestigacion',
    timestamps: false,
  });

  return FuenteInvestigacion;
};
