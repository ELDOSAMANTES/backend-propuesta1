// src/controllers/cucop.controller.js
import cucopService from '../services/cucop.service.js'; // Verifica la ruta del servicio

// <<< --- CORRECCIÓN: Exporta la CLASE --- >>>
export default class CucopController {
  /**
   * Maneja la petición GET /api/v1/cucop/buscar/:codigo
   * Busca un CUCOP por código usando el servicio y responde.
   */
  async getByCodigo(req, res, next) { // Incluye 'next' por si usas middleware de error
    const { codigo } = req.params; // Obtiene el código de los parámetros de la URL
    console.log(`[CucopController] Recibida petición para buscar código: '${codigo}'`);

    try {
      // Llama al método del servicio para buscar en la base de datos
      const producto = await cucopService.findByCodigo(codigo);
      console.log("[CucopController] Producto encontrado por el servicio:", producto);

      // Si se encuentra, responde con 200 OK y los datos
      res.status(200).json({
        message: 'Producto CUCOP encontrado',
        data: producto, // Envía el objeto { codigo, descripcion, unidad }
      });
    } catch (err) {
      // Si el servicio lanza un error (ej. no encontrado o error de BD)
      console.error("[CucopController] Error al buscar CUCOP:", err.message);

      // Determina el código de estado (404 si no se encontró, 500 para otros errores)
      const statusCode = err.message.includes('no encontrado o inactivo') ? 404 : 500;

      // Responde con el código de estado y el mensaje de error
      res.status(statusCode).json({
        message: err.message || 'Ocurrió un error al buscar el CUCOP',
      });

      // Alternativa si usas un middleware global de errores:
      // next(err);
    }
  }

  // Aquí podrías añadir otros métodos si necesitas más operaciones (listar, crear CUCOP, etc.)
  // async getAll(req, res, next) { ... }
  // async create(req, res, next) { ... }
}

// <<< --- YA NO SE EXPORTA 'new CucopController()' aquí --- >>>