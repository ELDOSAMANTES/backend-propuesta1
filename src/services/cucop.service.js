// src/services/cucop.service.js
import { models } from '../libs/sequelize.js'; // Asegúrate que la ruta sea correcta
const { Cucop } = models;

class CucopService {
  async findByCodigo(codigo) {
    console.log(`[CucopService] Buscando código: '${codigo}'`);
    if (!Cucop) { throw new Error("Modelo Cucop no cargado."); }

    const codigoLimpio = String(codigo).trim();
    try {
      console.log(`[CucopService] Ejecutando: Cucop.findOne({ where: { id: '${codigoLimpio}', activo: true } })`);
      const producto = await Cucop.findOne({ where: { id: codigoLimpio, activo: true } });
      console.log("[CucopService] Resultado de findOne:", producto ? producto.toJSON() : null);

      if (!producto) { throw new Error(`CUCOP '${codigoLimpio}' no encontrado o inactivo.`); }

      const resultadoMapeado = {
        codigo: producto.id,
        descripcion: producto.descripcion,
        unidad: producto.unidad_medida, // Revisa nombre de columna
      };
      console.log("[CucopService] Devolviendo:", resultadoMapeado);
      return resultadoMapeado;
    } catch (error) {
      console.error(`[CucopService] Error buscando '${codigoLimpio}':`, error);
      throw error;
    }
  }
}
export default new CucopService();