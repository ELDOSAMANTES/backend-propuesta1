import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import { setupModels } from '../database/models/index.js';

const sequelize = new Sequelize(
  config.dbName,
  config.dbUser,
  config.dbPassword ?? '',
  {
    host: config.dbHost,
    port: config.dbPort,
    dialect: 'postgres',
    logging: false,
  }
);

const models = setupModels(sequelize);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexión a PostgreSQL establecida.');
    await sequelize.sync({ alter: true });
  } catch (err) {
    console.error('❌ Error al conectar a la BD:', err);
  }
}

export { sequelize, models };
