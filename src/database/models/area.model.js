import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Area extends Model {}

  Area.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(120), allowNull: false },
  }, {
    sequelize,
    tableName: 'areas',
    modelName: 'Area',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Area;
};
