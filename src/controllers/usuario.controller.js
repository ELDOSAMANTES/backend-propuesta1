// src/controllers/usuario.controller.js
import { models } from '../libs/sequelize.js';

export async function getPerfil(req, res, next) {
  try {
    // ⚠️ NOTA: Como aún no tenemos login real (JWT), 
    // asumimos "hardcodeado" que es el Usuario con ID 1.
    const USER_ID_TEMPORAL = 1;

    const usuario = await models.Usuario.findByPk(USER_ID_TEMPORAL, {
      // Incluimos el Área para mostrar "Sistemas", "Admin", etc.
      include: [{ model: models.Area }] 
    });

    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.json(usuario);
  } catch (error) {
    next(error);
  }
}