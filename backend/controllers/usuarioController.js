import * as usuarioService from '../services/usuarioService.js';

export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch usuarios' });
  }
};

export const getUsuarioById = async (req, res) => {
  try {
    const usuario = await usuarioService.getUsuarioById(req.params.id);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario not found' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch usuario' });
  }
};

export const createUsuario = async (req, res) => {
  try {
    const newUsuario = await usuarioService.createUsuario(req.body);
    res.status(201).json(newUsuario);
  } catch (error) {
    console.error('Error creating usuario:', error);
    res.status(500).json({ error: 'Failed to create usuario' });
  }
};

export const updateUsuario = async (req, res) => {
  try {
    const updatedUsuario = await usuarioService.updateUsuario(req.params.id, req.body);
    if (!updatedUsuario) {
      return res.status(404).json({ error: 'Usuario not found' });
    }
    res.json(updatedUsuario);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update usuario' });
  }
};

export const deleteUsuario = async (req, res) => {
  try {
    const deleted = await usuarioService.deleteUsuario(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Usuario not found' });
    }
    res.json({ message: 'Usuario deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete usuario' });
  }
};
