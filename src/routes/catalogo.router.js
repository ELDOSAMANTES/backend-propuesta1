const express = require('express');
const CatalogoService = require('../services/catalogo.service');
const service = new CatalogoService();
const router = express.Router();

router.get('/conceptos', async (req, res, next) => {
  try {
    const conceptos = await service.getConceptos();
    res.json(conceptos);
  } catch (error) { next(error); }
});

router.get('/partidas-genericas/:idConcepto', async (req, res, next) => {
  try {
    const partidas = await service.getPartidasGenericas(req.params.idConcepto);
    res.json(partidas);
  } catch (error) { next(error); }
});

router.get('/partidas-especificas/:idGenerica', async (req, res, next) => {
  try {
    const partidas = await service.getPartidasEspecificas(req.params.idGenerica);
    res.json(partidas);
  } catch (error) { next(error); }
});

router.get('/cucops/:idEspecifica', async (req, res, next) => {
  try {
    const cucops = await service.getCucops(req.params.idEspecifica);
    res.json(cucops);
  } catch (error) { next(error); }
});

module.exports = router;