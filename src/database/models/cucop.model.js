import { Model, DataTypes } from 'sequelize';

const CUCOP_TABLE = 'cucop';

const CucopSchema = {
  // 1. CORRECCIÓN: Tu llave primaria es 'id', no 'clave_cucop_plus'
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING,
    field: 'id' // Nombre exacto en la BD
  },
  
  // 2. Descripción
  descripcion: {
    type: DataTypes.TEXT,
    field: 'descripcion'
  },

  // 3. CORRECCIÓN: En tu BD se llama 'unidad_medida'
  unidad: {
    type: DataTypes.STRING,
    field: 'unidad_medida' // Mapeamos la propiedad 'unidad' a la columna 'unidad_medida'
  },

  // 4. CORRECCIÓN: En tu BD se llama 'precio_unitario'
  precioEstimado: {
    type: DataTypes.DECIMAL(10, 2),
    field: 'precio_unitario', // Mapeamos 'precioEstimado' a 'precio_unitario'
    defaultValue: 0
  },

  // 5. Partida Específica
  partidaEspecifica: {
    type: DataTypes.STRING,
    field: 'partida_especifica'
  }
};

class Cucop extends Model {
  static associate(models) {
    // Sin relaciones por ahora
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: CUCOP_TABLE,
      modelName: 'Cucop',
      timestamps: false // Importante si tu tabla no tiene created_at/updated_at
    };
  }
}

export default function setupCucop(sequelize) {
  Cucop.init(CucopSchema, Cucop.config(sequelize));
  return Cucop;
}