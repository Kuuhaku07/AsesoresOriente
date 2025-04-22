import * as asesorService from '../services/asesorService.js';

export const createAsesor = async (req, res) => {
  try {
    const newAsesor = await asesorService.createAsesor(req.body);
    res.status(201).json(newAsesor);
  } catch (error) {
    console.error('Error creating asesor:', error);
    res.status(500).json({ error: 'Failed to create asesor' });
  }
};

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
