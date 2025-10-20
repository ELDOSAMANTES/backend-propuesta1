import { Sequelize } from 'sequelize';
import { config } from '../config/config.js';
import initModels from '../database/models/index.js';

const { host, port, user, pass, name } = config.db;

export const sequelize = new Sequelize(name, user, pass, {
  host,
  port,
  dialect: 'postgres',
  logging: false,
  define: {
    underscored: true,
    timestamps: true,
  },
});

export const models = initModels(sequelize);

export async function connectDB() {
  try {
    await sequelize.authenticate();
    await sequelize.sync(); // Para demo. En producción, usar migraciones.
    console.log('✅ Conexión a PostgreSQL establecida.');
  } catch (err) {
    console.error('❌ Error al conectar a la BD:', err);
    process.exit(1);
  }
}
