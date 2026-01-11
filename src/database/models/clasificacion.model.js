import { Model, DataTypes } from 'sequelize';

// Nombres de las tablas en tu base de datos
const CAPITULO_TABLE = 'capitulos';
const CONCEPTO_TABLE = 'conceptos';
const GENERICA_TABLE = 'partidas_genericas';
const ESPECIFICA_TABLE = 'partidas_especificas';

// --- ESQUEMAS (Columnas) ---
export const CapituloSchema = {
  idCapitulo: { field: 'id_capitulo', allowNull: false, primaryKey: true, type: DataTypes.INTEGER },
  descripcion: { type: DataTypes.TEXT }
};

export const ConceptoSchema = {
  idConcepto: { field: 'id_concepto', allowNull: false, primaryKey: true, type: DataTypes.INTEGER },
  descripcion: { type: DataTypes.TEXT },
  idCapitulo: { field: 'id_capitulo', type: DataTypes.INTEGER }
};

export const PartidaGenericaSchema = {
  idGenerica: { field: 'id_generica', allowNull: false, primaryKey: true, type: DataTypes.INTEGER },
  descripcion: { type: DataTypes.TEXT },
  idConcepto: { field: 'id_concepto', type: DataTypes.INTEGER }
};

export const PartidaEspecificaSchema = {
  idEspecifica: { field: 'id_especifica', allowNull: false, primaryKey: true, type: DataTypes.STRING }, // Es String (ej. '21101')
  descripcion: { type: DataTypes.TEXT },
  idGenerica: { field: 'id_generica', type: DataTypes.INTEGER }
};

// --- MODELOS ---
export class Capitulo extends Model {
  static config(sequelize) {
    return { sequelize, tableName: CAPITULO_TABLE, modelName: 'Capitulo', timestamps: false };
  }
}

export class Concepto extends Model {
  static config(sequelize) {
    return { sequelize, tableName: CONCEPTO_TABLE, modelName: 'Concepto', timestamps: false };
  }
}

export class PartidaGenerica extends Model {
  static config(sequelize) {
    return { sequelize, tableName: GENERICA_TABLE, modelName: 'PartidaGenerica', timestamps: false };
  }
}

export class PartidaEspecifica extends Model {
  static config(sequelize) {
    return { sequelize, tableName: ESPECIFICA_TABLE, modelName: 'PartidaEspecifica', timestamps: false };
  }
}