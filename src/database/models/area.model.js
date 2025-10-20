import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Area extends Model {}
  Area.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(120), allowNull: false, unique: true },
  }, {
    sequelize,
    tableName: 'areas',
    modelName: 'Area',
  });
  return Area;
};
