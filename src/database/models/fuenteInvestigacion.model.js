import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class FuenteInvestigacion extends Model {}

  FuenteInvestigacion.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    investigacion_id: { type: DataTypes.INTEGER, allowNull: false },
    
    nombre_fuente: { type: DataTypes.STRING(250), allowNull: false },
    tipo_fuente: { type: DataTypes.STRING(100), allowNull: true },
    url_fuente: { type: DataTypes.STRING(500), allowNull: true },
    
    // <<< --- COLUMNAS NUEVAS AGREGADAS --- >>>
    precio_unitario: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    numero_contrato: { type: DataTypes.STRING(100), allowNull: true },
    fecha_referencia: { type: DataTypes.DATEONLY, allowNull: true },
    descripcion_bien: { type: DataTypes.TEXT, allowNull: true },

  }, {
    sequelize,
    tableName: 'fuentes_investigacion',
    modelName: 'FuenteInvestigacion',
    timestamps: false,
  });

  return FuenteInvestigacion;
};