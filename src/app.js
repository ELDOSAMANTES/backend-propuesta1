import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { config } from './config/config.js';
import routes from './routes/index.js';
import { connectDB } from './libs/sequelize.js'; // <-- conexión con Sequelize

const app = express();

// --- Middlewares globales ---
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '5mb' }));

// --- Ruta raíz informativa ---
app.get('/', (req, res) => {
  res.json({
    name: 'Requisiciones API',
    docs: '/api/v1/health',
    endpoints: [
      'GET /api/v1/health',
      'GET /api/v1/requisiciones',
      'GET /api/v1/requisiciones/:id',
      'POST /api/v1/requisiciones',
      'PUT /api/v1/requisiciones/:id',
      'DELETE /api/v1/requisiciones/:id'
    ]
  });
});

// --- Rutas de la API ---
app.use('/api/v1', routes);

// --- Middleware de errores global ---
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('❌ Error detectado:', err);
  res.status(400).json({
    message: err.message ?? 'Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
});

// --- Inicialización de la aplicación ---
async function bootstrap() {
  try {
    await connectDB(); // <-- se conecta a la BD
    app.listen(config.port, () => {
      console.log(`🚀 Server running at http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar la aplicación:', error);
    process.exit(1);
  }
}

bootstrap();
