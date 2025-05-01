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
    // Map roles to role names or ids as per new schema if needed
    // Assuming usuarioService.getAllUsuarios returns role info correctly
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
    // Map role names to rol_id integers
    const roleMap = {
      'Asesor': 1,
      'Gerente': 2
    };
    const rol_id = roleMap[req.body.Rol] || null;

    // Map incoming body keys to new schema keys
    const usuarioData = {
      correo: req.body.Correo,
      contrasena: req.body.Contraseña,
      asesor_id: req.body.id_asesor,
      rol_id: rol_id,
      nombre_usuario: req.body.NombreUsuario
    };
    const newUsuario = await usuarioService.createUsuario(usuarioData);
    res.status(201).json(newUsuario);
  } catch (error) {
    console.error('Error creating usuario:', error);
    res.status(500).json({ error: 'Failed to create usuario' });
  }
};

/**
 * Actualiza un usuario existente identificado por ID con los datos recibidos.
 * Si el usuario no existe, responde con error 404.
 * Maneja la actualización de la foto de perfil si se sube un archivo.
 */
export const updateUsuario = async (req, res) => {
  try {
    const roleMap = {
      'Asesor': 1,
      'Gerente': 2
    };
    const rol_id = roleMap[req.body.Rol] || null;

    const usuarioData = {
      correo: req.body.Correo,
      contrasena: req.body.Contraseña,
      asesor_id: req.body.id_asesor,
      rol_id: rol_id,
      foto_perfil: req.file ? req.file.filename : undefined
    };

    const updatedUsuario = await usuarioService.updateUsuario(req.params.id, usuarioData);
    if (!updatedUsuario) {
      return res.status(404).json({ error: 'Usuario not found' });
    }
    res.json(updatedUsuario);
  } catch (error) {
    console.error('Error updating usuario:', error);
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
  const { identifier, Contraseña } = req.body;
  try {
    // Try to get user by correo or nombre_usuario
    const usuario = await usuarioService.getUsuarioWithAsesorByIdentifier(identifier);
    if (!usuario) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }
    // Fetch full user with password hash for password comparison
    const usuarioFull = await usuarioService.getUsuarioByIdentifier(identifier);
    const passwordMatch = await bcrypt.compare(Contraseña, usuarioFull.contrasena_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }
    const tokenPayload = {
      id: usuario.id,
      email: usuario.correo,
      role: usuario.rol,
      name: `${usuario.nombre} ${usuario.apellido}`,
      pfp: usuario.pfp
    };
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Obtiene el usuario actual basado en el token JWT.
 */
export const getCurrentUser = async (req, res) => {
  try {
    if (!req.userId) {
      console.error('No userId found in request');
      return res.status(400).json({ error: 'User ID missing in request' });
    }
    const usuario = await usuarioService.getUsuarioWithAsesorById(req.userId);
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario not found' });
    }
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch current user' });
  }
};
