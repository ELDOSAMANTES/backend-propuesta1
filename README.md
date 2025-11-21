<<<<<<< HEAD
# Requisiciones Backend (CRUD Segmentado)

Arquitectura en capas con Express + Sequelize + PostgreSQL.

## Requisitos
- Node.js 18+
- PostgreSQL 13+

## Configuración
1. Copia `.env.example` a `.env` y ajusta tus credenciales.
2. Instala dependencias:
   ```bash
   npm install
   ```
3. Ejecuta en desarrollo:
   ```bash
   npm run dev
   ```
   o en producción:
   ```bash
   npm start
   ```

## Endpoints
- `GET    /api/v1/health`
- `GET    /api/v1/requisiciones`
- `GET    /api/v1/requisiciones/:id`
- `POST   /api/v1/requisiciones`
- `PUT    /api/v1/requisiciones/:id`
- `DELETE /api/v1/requisiciones/:id`

## Estructura
Ver carpeta `src/` para módulos segmentados por:
- `config/`, `libs/`, `database/models/`, `services/`, `controllers/`, `routes/`
=======
# backend-2.0
hola soy kevin
>>>>>>> 03c77f5480c7be6a34a4de940ead07b9ef5a051a
