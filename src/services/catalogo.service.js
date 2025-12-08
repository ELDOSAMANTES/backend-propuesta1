const { models } = require('../libs/sequelize');

class CatalogoService {
  
  async getConceptos() {
    // Obtiene todos los conceptos para el primer dropdown
    return await models.Concepto.findAll();
  }

  async getPartidasGenericas(idConcepto) {
    // Obtiene genéricas filtradas por concepto
    return await models.PartidaGenerica.findAll({
      where: { id_concepto: idConcepto }
    });
  }

  async getPartidasEspecificas(idGenerica) {
    // Obtiene específicas filtradas por genérica
    return await models.PartidaEspecifica.findAll({
      where: { id_generica: idGenerica }
    });
  }

  async getCucops(idEspecifica) {
    // Obtiene los productos finales filtrados por partida específica
    return await models.CucopDetalle.findAll({
      where: { partida_especifica: idEspecifica }
    });
  }
}

module.exports = CatalogoService;