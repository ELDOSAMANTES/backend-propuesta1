import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Usuario extends Model {}

  Usuario.init({
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    rol: { type: DataTypes.STRING(50), allowNull: true },
    area_id: { type: DataTypes.INTEGER, allowNull: false },
  }, {
    sequelize,
    tableName: 'usuarios',
    modelName: 'Usuario',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Usuario;
};
