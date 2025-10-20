import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class InvestigacionMercado extends Model {}
  InvestigacionMercado.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    proveedor_seleccionado: { type: DataTypes.STRING(160) },
    razon_seleccion: { type: DataTypes.TEXT },
  }, {
    sequelize,
    tableName: 'investigaciones_mercado',
    modelName: 'InvestigacionMercado',
  });
  return InvestigacionMercado;
};
