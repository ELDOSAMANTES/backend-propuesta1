// src/database/models/requisicion.model.js
import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Requisicion extends Model {}

  Requisicion.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      folio: { type: DataTypes.STRING(50), allowNull: false, unique: true },
      fecha_elaboracion: { type: DataTypes.DATEONLY, allowNull: false },
      usuario_id: { type: DataTypes.INTEGER, allowNull: false, field: 'usuario_id' },
      area_id: { type: DataTypes.INTEGER, allowNull: false, field: 'area_id' },
      tipo_contratacion: { type: DataTypes.STRING(120) },
      programa_proyecto: { type: DataTypes.STRING(180) },
      justificacion: { type: DataTypes.TEXT },
      estatus: { type: DataTypes.STRING(40), defaultValue: 'CREADA' },
      partida_id: { type: DataTypes.STRING(64) },
      
      // <<< --- CORRECCIÓN AQUÍ --- >>>
      // Cambiado de STRING(255) a TEXT para soportar el JSON largo de direcciones
      lugar_entrega: { type: DataTypes.TEXT }, 

      created_at: { type: DataTypes.DATE, allowNull: true },
      updated_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      tableName: 'requisiciones',
      modelName: 'Requisicion',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Requisicion;
};