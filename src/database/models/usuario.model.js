import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Usuario extends Model {}
  Usuario.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre: { type: DataTypes.STRING(150), allowNull: false },
    email: { type: DataTypes.STRING(160), allowNull: false, unique: true },
  }, {
    sequelize,
    tableName: 'usuarios',
    modelName: 'Usuario',
  });
  return Usuario;
};
