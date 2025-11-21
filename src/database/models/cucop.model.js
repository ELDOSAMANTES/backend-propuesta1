// src/database/models/cucop.model.js
import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Cucop extends Model {}
  Cucop.init(
    {
      id: { type: DataTypes.STRING(32), primaryKey: true, allowNull: false },
      descripcion: { type: DataTypes.TEXT, allowNull: false },
      unidad_medida: { type: DataTypes.STRING(50), allowNull: false },
      activo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
    },
    { sequelize, tableName: 'cucop', modelName: 'Cucop', timestamps: true, underscored: true }
  );
  return Cucop;
};