import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Partida extends Model {}
  Partida.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    partida_numero: { type: DataTypes.INTEGER, allowNull: false },
    cucop: { type: DataTypes.STRING(50) },
    descripcion: { type: DataTypes.TEXT, allowNull: false },
    cantidad: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    unidad: { type: DataTypes.STRING(40), defaultValue: 'PIEZA' },
    precio_unitario: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
    importe: { type: DataTypes.DECIMAL(12,2), defaultValue: 0 },
  }, {
    sequelize,
    tableName: 'partidas',
    modelName: 'Partida',
  });
  return Partida;
};
