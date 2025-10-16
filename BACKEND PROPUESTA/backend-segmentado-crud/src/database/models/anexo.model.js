import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Anexo extends Model {}
  Anexo.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nombre_archivo: { type: DataTypes.STRING(180), allowNull: false },
    url_archivo: { type: DataTypes.STRING(500), allowNull: false },
    tipo_documento: { type: DataTypes.STRING(60) },
    fecha_subida: { type: DataTypes.DATEONLY },
  }, {
    sequelize,
    tableName: 'anexos',
    modelName: 'Anexo',
  });
  return Anexo;
};
