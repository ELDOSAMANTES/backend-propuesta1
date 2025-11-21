import { DataTypes, Model } from 'sequelize';

export default (sequelize) => {
  class Anexo extends Model {}

  Anexo.init({
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    requisicion_id: { type: DataTypes.INTEGER, allowNull: false },
    nombre_archivo: { type: DataTypes.STRING(180), allowNull: false },
    url_archivo: { type: DataTypes.STRING(500), allowNull: false },
    tipo_documento: { type: DataTypes.STRING(60) },
    fecha_subida: { type: DataTypes.DATEONLY },
  }, {
    sequelize,
    tableName: 'anexos',
    modelName: 'Anexo',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });

  return Anexo;
};
