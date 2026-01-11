import { sequelize } from '../libs/sequelize.js';
import { QueryTypes } from 'sequelize';

class CucopService {

  // 1. Obtener todos los CAPÍTULOS
  async getCapitulos() {
    const query = 'SELECT id_capitulo, descripcion FROM capitulos ORDER BY id_capitulo';
    const data = await sequelize.query(query, { type: QueryTypes.SELECT });
    return data;
  }

  // 2. Obtener GENÉRICAS por Capítulo
  async getGenericas(capituloId) {
    const query = `
      SELECT g.id_generica, g.descripcion 
      FROM partidas_genericas g
      INNER JOIN conceptos c ON g.id_concepto = c.id_concepto
      WHERE c.id_capitulo = :capituloId
      ORDER BY g.id_generica
    `;
    const data = await sequelize.query(query, { 
      replacements: { capituloId },
      type: QueryTypes.SELECT 
    });
    return data;
  }

  // 3. Obtener ESPECÍFICAS por Genérica
  async getEspecificas(genericaId) {
    const query = `
      SELECT id_especifica, descripcion 
      FROM partidas_especificas 
      WHERE id_generica = :genericaId
      ORDER BY id_especifica
    `;
    const data = await sequelize.query(query, { 
      replacements: { genericaId },
      type: QueryTypes.SELECT 
    });
    return data;
  }

  // 4. Obtener PRODUCTOS (Cucop) - CORREGIDO
  // Usamos los nombres reales de tu base de datos
  async getProductos(partidaEspecificaId) {
    const query = `
      SELECT 
        id, 
        descripcion, 
        unidad_medida,    -- CORREGIDO (Antes decía 'unidad')
        precio_unitario   -- CORREGIDO (Antes decía 'precio_estimado')
      FROM cucop 
      WHERE partida_especifica = :partidaEspecificaId
    `;
    const data = await sequelize.query(query, { 
      replacements: { partidaEspecificaId },
      type: QueryTypes.SELECT 
    });
    return data;
  }
}

export default CucopService;