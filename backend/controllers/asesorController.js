import * as asesorService from '../services/asesorService.js';


/**
 * Crea un nuevo asesor con los datos recibidos en el cuerpo de la petición.
 * Responde con el asesor creado.
 */
export const createAsesor = async (req, res) => {
  try {
    // Map incoming keys from PascalCase to lowercase keys expected by service
    const asesorData = {
      nombre: req.body.Nombre,
      apellido: req.body.Apellido,
      cedula: req.body.Cedula,
      telefono: req.body.Telefono,
      correo: req.body.Correo,
      fecha_ingreso: req.body.FechaIngreso, // optional, may be undefined
      comision_base: req.body.ComisionBase, // optional
      activo: req.body.Activo, // optional
      especialidad: req.body.Especialidad, // optional
      foto_perfil: req.body.Pfp,
      direccion: req.body.Direccion // optional
    };
    const newAsesor = await asesorService.createAsesor(asesorData);
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
    // Fetch current asesor to get existing fecha_ingreso if not provided
    const currentAsesor = await asesorService.getAsesorById(req.params.id);
    if (!currentAsesor) {
      return res.status(404).json({ error: 'Asesor not found' });
    }

    // Map incoming keys from PascalCase to lowercase keys expected by service
    const asesorData = {
      nombre: req.body.Nombre,
      apellido: req.body.Apellido,
      cedula: req.body.Cedula,
      telefono: req.body.Telefono,
      correo: req.body.Correo,
      fecha_ingreso: req.body.FechaIngreso ?? currentAsesor.fecha_ingreso,
      comision_base: req.body.ComisionBase ?? currentAsesor.comision_base,
      activo: req.body.Activo ?? currentAsesor.activo,
      especialidad: req.body.Especialidad ?? currentAsesor.especialidad,
      foto_perfil: req.body.Pfp ?? currentAsesor.foto_perfil,
      direccion: req.body.Direccion ?? currentAsesor.direccion
    };
    const updatedAsesor = await asesorService.updateAsesor(req.params.id, asesorData);
    if (!updatedAsesor) {
      return res.status(404).json({ error: 'Asesor not found' });
    }
    res.json(updatedAsesor);
  } catch (error) {
    console.error('Error updating asesor:', error);
    res.status(500).json({ error: 'Failed to update asesor' });
  }
};
