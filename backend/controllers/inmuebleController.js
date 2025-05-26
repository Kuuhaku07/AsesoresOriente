import * as inmuebleService from '../services/inmuebleService.js';

/**
 * Controlador para crear un nuevo inmueble.
 */
export const createInmueble = async (req, res) => {
  try {
    const inmuebleData = req.body;
    const newInmueble = await inmuebleService.createInmueble(inmuebleData);
    res.status(201).json(newInmueble);
  } catch (error) {
    console.error('Error creating inmueble:', error);
    res.status(500).json({ error: 'Failed to create inmueble' });
  }
};

/**
 * Controladores para obtener datos de opciones para dropdowns.
 */
export const getTipoInmuebles = async (req, res) => {
  try {
    const tipos = await inmuebleService.getTipoInmuebles();
    res.json(tipos);
  } catch (error) {
    console.error('Error getting tipoInmuebles:', error);
    res.status(500).json({ error: 'Failed to get tipoInmuebles' });
  }
};

export const getEstadoInmuebles = async (req, res) => {
  try {
    const estados = await inmuebleService.getEstadoInmuebles();
    res.json(estados);
  } catch (error) {
    console.error('Error getting estadoInmuebles:', error);
    res.status(500).json({ error: 'Failed to get estadoInmuebles' });
  }
};

export const getAsesores = async (req, res) => {
  try {
    const asesores = await inmuebleService.getAsesores();
    res.json(asesores);
  } catch (error) {
    console.error('Error getting asesores:', error);
    res.status(500).json({ error: 'Failed to get asesores' });
  }
};

export const getPropietariosPersona = async (req, res) => {
  try {
    const propietarios = await inmuebleService.getPropietariosPersona();
    res.json(propietarios);
  } catch (error) {
    console.error('Error getting propietarios persona:', error);
    res.status(500).json({ error: 'Failed to get propietarios persona' });
  }
};

export const getPropietariosEmpresa = async (req, res) => {
  try {
    const propietarios = await inmuebleService.getPropietariosEmpresa();
    res.json(propietarios);
  } catch (error) {
    console.error('Error getting propietarios empresa:', error);
    res.status(500).json({ error: 'Failed to get propietarios empresa' });
  }
};

export const getEstados = async (req, res) => {
  try {
    const estados = await inmuebleService.getEstados();
    res.json(estados);
  } catch (error) {
    console.error('Error getting estados:', error);
    res.status(500).json({ error: 'Failed to get estados' });
  }
};

export const getCiudades = async (req, res) => {
  try {
    const estadoId = req.params.estadoId;
    const ciudades = await inmuebleService.getCiudades(estadoId);
    res.json(ciudades);
  } catch (error) {
    console.error('Error getting ciudades:', error);
    res.status(500).json({ error: 'Failed to get ciudades' });
  }
};

export const getZonas = async (req, res) => {
  try {
    const ciudadId = req.params.ciudadId;
    const zonas = await inmuebleService.getZonas(ciudadId);
    res.json(zonas);
  } catch (error) {
    console.error('Error getting zonas:', error);
    res.status(500).json({ error: 'Failed to get zonas' });
  }
};

export const getTipoNegocios = async (req, res) => {
  try {
    const tipos = await inmuebleService.getTipoNegocios();
    res.json(tipos);
  } catch (error) {
    console.error('Error getting tipoNegocios:', error);
    res.status(500).json({ error: 'Failed to get tipoNegocios' });
  }
};

export const getCaracteristicas = async (req, res) => {
  try {
    const caracteristicas = await inmuebleService.getCaracteristicas();
    res.json(caracteristicas);
  } catch (error) {
    console.error('Error getting caracteristicas:', error);
    res.status(500).json({ error: 'Failed to get caracteristicas' });
  }
};

/**
 * Controladores para crear y actualizar propietarios persona y empresa
 */

export const createPropietarioPersona = async (req, res) => {
  try {
    const propietarioData = req.body;
    const newPropietario = await inmuebleService.createPropietarioPersona(propietarioData);
    res.status(201).json(newPropietario);
  } catch (error) {
    console.error('Error creating propietario persona:', error);
    res.status(500).json({ error: 'Failed to create propietario persona' });
  }
};

export const updatePropietarioPersona = async (req, res) => {
  try {
    const propietarioId = req.params.id;
    const propietarioData = req.body;
    const updatedPropietario = await inmuebleService.updatePropietarioPersona(propietarioId, propietarioData);
    res.json(updatedPropietario);
  } catch (error) {
    console.error('Error updating propietario persona:', error);
    res.status(500).json({ error: 'Failed to update propietario persona' });
  }
};

export const createPropietarioEmpresa = async (req, res) => {
  try {
    const propietarioData = req.body;
    const newPropietario = await inmuebleService.createPropietarioEmpresa(propietarioData);
    res.status(201).json(newPropietario);
  } catch (error) {
    console.error('Error creating propietario empresa:', error);
    res.status(500).json({ error: 'Failed to create propietario empresa' });
  }
};

export const updatePropietarioEmpresa = async (req, res) => {
  try {
    const propietarioId = req.params.id;
    const propietarioData = req.body;
    const updatedPropietario = await inmuebleService.updatePropietarioEmpresa(propietarioId, propietarioData);
    res.json(updatedPropietario);
  } catch (error) {
    console.error('Error updating propietario empresa:', error);
    res.status(500).json({ error: 'Failed to update propietario empresa' });
  }
};

export const getEstadoCivil = async (req, res) => {
  try {
    const estados = await inmuebleService.getEstadoCivil();
    res.json(estados);
  } catch (error) {
    console.error('Error getting estado civil:', error);
    res.status(500).json({ error: 'Failed to get estado civil' });
  }
};
