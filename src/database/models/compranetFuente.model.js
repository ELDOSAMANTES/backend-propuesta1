// src/database/models/compranetFuente.model.js
import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class CompranetFuente extends Model {}

  CompranetFuente.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    requisicion_id: { type: DataTypes.INTEGER, allowNull: false }, // Herencia por ID de Requisición
    
    // Campos Ricos de Compranet
    fuente_id: { type: DataTypes.TEXT, allowNull: true },
    codigo_contrato: { type: DataTypes.STRING(100), allowNull: true },
    codigo_expediente: { type: DataTypes.STRING(100), allowNull: true },
    proveedor: { type: DataTypes.STRING(255), allowNull: false },
    titulo_contrato: { type: DataTypes.TEXT, allowNull: true },
    descripcion_contrato: { type: DataTypes.TEXT, allowNull: true },
    
    // Campos que el Frontend puede enviar
    precio_unitario: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    
    // Campos de metadatos de Compranet
    contract_type: { type: DataTypes.STRING(50), allowNull: true },
    work_category_id: { type: DataTypes.STRING(50), allowNull: true },
    tipo_contratacion: { type: DataTypes.STRING(50), allowNull: true },
    tipo_expediente: { type: DataTypes.STRING(50), allowNull: true },
    importe: { type: DataTypes.DECIMAL(16, 2), allowNull: true },
    moneda: { type: DataTypes.STRING(10), defaultValue: 'MXN' },
    fecha_inicio: { type: DataTypes.DATEONLY, allowNull: true },
    fecha_fin: { type: DataTypes.DATEONLY, allowNull: true },
    
    // Campos de proyecto/referencia
    project_code: { type: DataTypes.STRING(50), allowNull: true },
    ff_fecha_inicio: { type: DataTypes.DATEONLY, allowNull: true },
    ff_fecha_fin: { type: DataTypes.DATEONLY, allowNull: true },
    url_anuncio: { type: DataTypes.STRING(500), allowNull: true },
    
  }, {
    sequelize,
    tableName: 'compranet_fuentes', // Nombre de la nueva tabla
    modelName: 'CompranetFuente',
    timestamps: true,
    underscored: true,
  });

  return CompranetFuente;
};