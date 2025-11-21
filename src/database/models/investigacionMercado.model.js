import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class InvestigacionMercado extends Model {}

  InvestigacionMercado.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    requisicion_id: { type: DataTypes.INTEGER, allowNull: false },
    proveedor: { type: DataTypes.STRING(150), allowNull: false },
    precio_unitario: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    url_cotizacion: { type: DataTypes.STRING(500), allowNull: true },
    observaciones: { type: DataTypes.TEXT, allowNull: true },
  }, {
    sequelize,
    tableName: 'investigaciones_mercado',
    modelName: 'InvestigacionMercado',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return InvestigacionMercado;
};
