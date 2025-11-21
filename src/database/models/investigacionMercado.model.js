import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class InvestigacionMercado extends Model {}

  InvestigacionMercado.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    requisicion_id: { type: DataTypes.INTEGER, allowNull: false },
    
    // CORRECCIÓN: Usamos los campos de la tabla 'singular' que coinciden con tu servicio
    proveedor_seleccionado: { type: DataTypes.STRING(180), allowNull: true }, 
    razon_seleccion: { type: DataTypes.TEXT, allowNull: true },
    
    // Eliminamos 'proveedor', 'precio_unitario' y 'url_cotizacion' porque esos
    // pertenecen a la tabla de detalles (cotizaciones), no a este encabezado.
  }, {
    sequelize,
    tableName: 'investigacion_mercado', // <--- OJO: Nombre en singular
    modelName: 'InvestigacionMercado',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return InvestigacionMercado;
};