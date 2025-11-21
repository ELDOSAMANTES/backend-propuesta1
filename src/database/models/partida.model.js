// src/database/models/partida.model.js
import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Partida extends Model {}

  Partida.init(
    {
      id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
      requisicion_id: { type: DataTypes.INTEGER, allowNull: false },
      // 🔽 si hoy está "allowNull: false", cámbialo a true o pon default
      clave: { type: DataTypes.STRING(32), allowNull: true }, // CUCOP opcional
      descripcion: { type: DataTypes.TEXT, allowNull: false },
      cantidad: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 1 },
      unidad: { type: DataTypes.STRING(30), allowNull: false },
      precio_unitario: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      importe: { type: DataTypes.DECIMAL(12,2), allowNull: false, defaultValue: 0 },
      created_at: { type: DataTypes.DATE, allowNull: true },
      updated_at: { type: DataTypes.DATE, allowNull: true },
    },
    {
      sequelize,
      tableName: 'partidas',
      modelName: 'Partida',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  return Partida;
};
