import * as asesorService from '../services/asesorService.js';


/**
 * Crea un nuevo asesor con los datos recibidos en el cuerpo de la petición.
 * Responde con el asesor creado.
 */
export const createAsesor = async (req, res) => {
  try {
    const newAsesor = await asesorService.createAsesor(req.body);
    res.status(201).json(newAsesor);
  } catch (error) {
    console.error('Error creating asesor:', error);
    res.status(500).json({ error: 'Failed to create asesor' });
  }
};


/**
 * Actualiza un asesor existente identificado por ID con los datos recibidos.
 * Si el asesor no existe, responde con error 404.
 */
export const updateAsesor = async (req, res) => {
  try {
    const updatedAsesor = await asesorService.updateAsesor(req.params.id, req.body);
    if (!updatedAsesor) {
      return res.status(404).json({ error: 'Asesor not found' });
    }
    res.json(updatedAsesor);
  } catch (error) {
    console.error('Error updating asesor:', error);
    res.status(500).json({ error: 'Failed to update asesor' });
  }
};
