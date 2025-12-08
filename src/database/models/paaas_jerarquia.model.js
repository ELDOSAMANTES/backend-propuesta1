const { Model, DataTypes } = require('sequelize');

// 1. Modelo Concepto
const CONCEPTO_TABLE = 'concepto';
const ConceptoSchema = {
  id_concepto: { type: DataTypes.INTEGER, primaryKey: true },
  descripcion: { type: DataTypes.STRING },
  id_capitulo: { type: DataTypes.INTEGER } // Relación con capítulo
};
class Concepto extends Model {
  static associate(models) {
    this.hasMany(models.PartidaGenerica, { foreignKey: 'id_concepto', as: 'partidasGenericas' });
  }
  static config(sequelize) {
    return { sequelize, tableName: CONCEPTO_TABLE, modelName: 'Concepto', timestamps: false };
  }
}

// 2. Modelo Partida Genérica
const PARTIDA_GENERICA_TABLE = 'partida_generica';
const PartidaGenericaSchema = {
  id_generica: { type: DataTypes.INTEGER, primaryKey: true },
  descripcion: { type: DataTypes.STRING },
  id_concepto: { type: DataTypes.INTEGER }
};
class PartidaGenerica extends Model {
  static associate(models) {
    this.belongsTo(models.Concepto, { foreignKey: 'id_concepto' });
    this.hasMany(models.PartidaEspecifica, { foreignKey: 'id_generica', as: 'partidasEspecificas' });
  }
  static config(sequelize) {
    return { sequelize, tableName: PARTIDA_GENERICA_TABLE, modelName: 'PartidaGenerica', timestamps: false };
  }
}

// 3. Modelo Partida Específica
const PARTIDA_ESPECIFICA_TABLE = 'partida_especifica';
const PartidaEspecificaSchema = {
  id_especifica: { type: DataTypes.INTEGER, primaryKey: true },
  descripcion: { type: DataTypes.STRING },
  id_generica: { type: DataTypes.INTEGER }
};
class PartidaEspecifica extends Model {
  static associate(models) {
    this.belongsTo(models.PartidaGenerica, { foreignKey: 'id_generica' });
    this.hasMany(models.CucopDetalle, { foreignKey: 'partida_especifica', as: 'cucops' });
  }
  static config(sequelize) {
    return { sequelize, tableName: PARTIDA_ESPECIFICA_TABLE, modelName: 'PartidaEspecifica', timestamps: false };
  }
}

// 4. Modelo CUCOP Detalle (El producto final)
const CUCOP_DETALLE_TABLE = 'cucop_detalle';
const CucopDetalleSchema = {
  id_cucop: { type: DataTypes.INTEGER, primaryKey: true }, // Ajusta si la PK es diferente en tu SQL
  descripcion: { type: DataTypes.STRING },
  partida_especifica: { type: DataTypes.INTEGER },
  // ... otros campos como unidad de medida
};
class CucopDetalle extends Model {
  static associate(models) {
    this.belongsTo(models.PartidaEspecifica, { foreignKey: 'partida_especifica' });
  }
  static config(sequelize) {
    return { sequelize, tableName: CUCOP_DETALLE_TABLE, modelName: 'CucopDetalle', timestamps: false };
  }
}

module.exports = { 
  Concepto, ConceptoSchema, 
  PartidaGenerica, PartidaGenericaSchema, 
  PartidaEspecifica, PartidaEspecificaSchema, 
  CucopDetalle, CucopDetalleSchema 
};