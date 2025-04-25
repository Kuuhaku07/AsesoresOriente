import * as usuarioService from '../services/usuarioService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';






/**
 * Obtiene todos los usuarios de la base de datos.
 * Responde con un arreglo de usuarios en formato JSON.
 */
export const getAllUsuarios = async (req, res) => {
  try {
    const usuarios = await usuarioService.getAllUsuarios();
    res.json(usuarios);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch usuarios' });
  }
};

/**
 * Obtiene un usuario por su ID.
 * Si no se encuentra, responde con error 404.
 */
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

/**
 * Crea un nuevo usuario con los datos recibidos en el cuerpo de la petición.
 * Responde con el usuario creado.
 */
export const createUsuario = async (req, res) => {
  try {
    const newUsuario = await usuarioService.createUsuario(req.body);
    res.status(201).json(newUsuario);
  } catch (error) {
    console.error('Error creating usuario:', error);
    res.status(500).json({ error: 'Failed to create usuario' });
  }
};

/**
 * Actualiza un usuario existente identificado por ID con los datos recibidos.
 * Si el usuario no existe, responde con error 404.
 */
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

/**
 * Elimina un usuario identificado por ID.
 * Si el usuario no existe, responde con error 404.
 */
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

/**
 * Función para autenticar un usuario y generar un token JWT.
 * Verifica las credenciales y, si son correctas, devuelve un token firmado con la clave secreta.
 */
export const login = async (req, res) => {
  const { Correo, Contraseña } = req.body;
  try {
    const usuario = await usuarioService.getUsuarioWithAsesorByCorreo(Correo);
    if (!usuario) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    // Fetch full user with password hash for password comparison
    const usuarioFull = await usuarioService.getUsuarioByCorreo(Correo);
    const passwordMatch = await bcrypt.compare(Contraseña, usuarioFull.Contraseña);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const tokenPayload = {
      id: usuario.id,
      email: usuario.Correo,
      role: usuario.Rol,
      name: `${usuario.Nombre} ${usuario.Apellido}`,
      avatar: usuario.Pfp
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};