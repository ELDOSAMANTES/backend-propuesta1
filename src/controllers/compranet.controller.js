// --- ESTO ES LO QUE TE FALTABA CAMBIAR ---
// En lugar de 'require', usamos 'import'
import CompranetService from '../services/compranet.service.js'; 

const service = new CompranetService();

export async function buscarHistorico(req, res, next) {
  try {
    const { buscar, limit } = req.query;

    const data = await service.buscarEnHistorico({ 
      termino: buscar, 
      limite: limit ? parseInt(limit, 10) : 50
    });

    res.json({ 
      message: 'Búsqueda en histórico exitosa', 
      data 
    });
  } catch (err) {
    next(err);
  }
}