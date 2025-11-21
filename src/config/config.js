import 'dotenv/config';

export const config = {
  port: process.env.PORT || 3001,
  dbHost: process.env.DB_HOST || 'localhost',
  dbPort: Number(process.env.DB_PORT || 5432),
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD ?? '',  // <-- siempre string
  dbName: process.env.DB_NAME || 'requisiciones_db',
};
