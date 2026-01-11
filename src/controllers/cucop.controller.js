import CucopService from '../services/cucop.service.js';

const service = new CucopService();

// Obtener lista inicial de capítulos
export const getCapitulos = async (req, res, next) => {
  try {
    const capitulos = await service.getCapitulos();
    res.json(capitulos);
  } catch (error) {
    next(error);
  }
};

// Obtener genéricas dado un id de capítulo
export const getGenericas = async (req, res, next) => {
  try {
    const { id } = req.params; // ID del Capítulo
    const genericas = await service.getGenericas(id);
    res.json(genericas);
  } catch (error) {
    next(error);
  }
};

// Obtener específicas dado un id de genérica
export const getEspecificas = async (req, res, next) => {
  try {
    const { id } = req.params; // ID de la Genérica
    const especificas = await service.getEspecificas(id);
    res.json(especificas);
  } catch (error) {
    next(error);
  }
};

// Obtener productos finales dado el código de partida específica
export const getProductos = async (req, res, next) => {
  try {
    const { id } = req.params; // ID de la Específica (ej. 21101)
    const productos = await service.getProductos(id);
    res.json(productos);
  } catch (error) {
    next(error);
  }
};