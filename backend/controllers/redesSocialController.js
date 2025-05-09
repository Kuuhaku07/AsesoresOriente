import * as redesSocialService from '../services/redesSocialService.js';

export const getAllRedesSociales = async (req, res) => {
  try {
    const redes = await redesSocialService.getAllRedesSociales();
    res.json(redes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las redes sociales' });
  }
};
