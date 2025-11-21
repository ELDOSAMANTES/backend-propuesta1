// src/database/models/investigacionDetalles.model.js
import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class InvestigacionDetalles extends Model {}

  InvestigacionDetalles.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    // Clave foránea que apunta directamente a la Requisición
    requisicion_id: { 
      type: DataTypes.INTEGER, 
      allowNull: false, 
      unique: true // Aseguramos que solo haya un registro de detalles por requisición
    },
    
    // Campos del GANADOR (Resumen)
    proveedor_seleccionado: { type: DataTypes.STRING(255), allowNull: false },
    razon_seleccion: { type: DataTypes.TEXT, allowNull: false },
    
    // CAMPO CRÍTICO: Aquí guardaremos el JSON completo del array de fuentes consultadas
    fuentes_consultadas_json: { type: DataTypes.TEXT, allowNull: false }, 
    
    // Campos de metadatos (opcionalmente)
    fecha_analisis: { type: DataTypes.DATEONLY, allowNull: true },

  }, {
    sequelize,
    tableName: 'investigacion_detalles', // Nombre de la nueva tabla
    modelName: 'InvestigacionDetalles',
    timestamps: true,
    underscored: true,
  });

  return InvestigacionDetalles;
};