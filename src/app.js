// src/app.js
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/config.js';
// Importa la FUNCIÓN que configura las rutas
import routerApi from './routes/index.js'; // Asegúrate que index.js exporte la función
import { connectDB } from './libs/sequelize.js';

const app = express();

// Middlewares (sin cambios)
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

// Ruta raíz (sin cambios)
app.get('/', (_req, res) => {
  res.json({
    name: 'Requisiciones API',
    docs: '/api/v1/health',
    // ... (resto sin cambios)
  });
});

// Ruta health (sin cambios)
app.get('/api/v1/health', (_req, res) => {
  res.status(200).json({ status: 'ok', message: 'Servidor en ejecución' });
});

// <<< --- CORRECCIÓN AQUÍ --- >>>
// LLAMA a la función importada y pásale la 'app' para que configure las rutas
routerApi(app);
// Ya NO necesitas: app.use('/api/v1', routes);

// (Opcional) Ruta de eco (sin cambios)
app.post('/api/v1/_debug/echo', (req, res) => {
  res.json({ contentType: req.headers['content-type'], body: req.body });
});

// Manejador 404 (sin cambios)
app.use((req, res, next) => {
  if (res.headersSent) return next();
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
});

// Manejador de Errores Global (sin cambios)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('❌ Error detectado:', err);
  // ... (resto del manejador de errores sin cambios) ...
  const isValidation = err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError';
  const isFK = err.name === 'SequelizeForeignKeyConstraintError';

  if (isValidation) { /* ... */ }
  if (isFK) { /* ... */ }
  res.status(err.status || 400).json({
    message: err.message ?? 'Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// Función bootstrap (sin cambios)
async function bootstrap() {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(`🚀 Server running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();

export default app; // Opcional si usas tests u otra cosa