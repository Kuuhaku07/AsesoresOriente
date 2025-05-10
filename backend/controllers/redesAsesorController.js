import * as redesAsesorService from '../services/redesAsesorService.js';
import * as usuarioService from '../services/usuarioService.js';

export const getRedesAsesor = async (req, res) => {
  try {
    const userId = req.userId;
    const usuario = await usuarioService.getUsuarioById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const asesorId = usuario.asesor_id;
    const redes = await redesAsesorService.getRedesByAsesorId(asesorId);
    res.json(redes);
  } catch (error) {
    console.error('Error getting redes asesor:', error);
    res.status(500).json({ error: 'Error al obtener las redes sociales' });
  }
};

export const createRedAsesor = async (req, res) => {
  try {
    // console.log('Authenticated userId:', req.userId);
    // console.log('Request body:', req.body);
    const userId = req.userId;
    const usuario = await usuarioService.getUsuarioById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const asesorId = usuario.asesor_id;
    const { red_social_id, url, identifier } = req.body;

    // Check if asesor already has this red_social_id
    const exists = await redesAsesorService.existsRedAsesor(asesorId, red_social_id);
    if (exists) {
      return res.status(400).json({ error: 'La red social ya está asociada al asesor' });
    }

    const newRed = await redesAsesorService.createRedAsesor({
      asesor_id: asesorId,
      red_social_id,
      url,
      contenido: identifier || null
    });
    res.status(201).json(newRed);
  } catch (error) {
    console.error('Error creating red asesor:', error);
    res.status(500).json({ error: 'Error al crear la red social' });
  }
};

export const updateRedAsesor = async (req, res) => {
  try {
    const userId = req.userId;
    const usuario = await usuarioService.getUsuarioById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const asesorId = usuario.asesor_id;
    const id = parseInt(req.params.id, 10);
    const { red_social_id, url } = req.body;

    // Check if the red asesor exists and belongs to asesor
    const existing = await redesAsesorService.getRedAsesorById(id);
    if (!existing || existing.asesor_id !== asesorId) {
      return res.status(404).json({ error: 'Red social no encontrada' });
    }

    const updated = await redesAsesorService.updateRedAsesor(id, {
      red_social_id,
      url,
      contenido: req.body.identifier || null
    });
    res.json(updated);
  } catch (error) {
    console.error('Error updating red asesor:', error);
    res.status(500).json({ error: 'Error al actualizar la red social' });
  }
};

export const deleteRedAsesor = async (req, res) => {
  try {
    const userId = req.userId;
    const usuario = await usuarioService.getUsuarioById(userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    const asesorId = usuario.asesor_id;
    const id = parseInt(req.params.id, 10);

    const existing = await redesAsesorService.getRedAsesorById(id);
    if (!existing || existing.asesor_id !== asesorId) {
      return res.status(404).json({ error: 'Red social no encontrada' });
    }

    await redesAsesorService.deleteRedAsesor(id);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting red asesor:', error);
    res.status(500).json({ error: 'Error al eliminar la red social' });
  }
};
