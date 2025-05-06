import * as usuarioService from '../services/usuarioService.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

//const ACCESS_TOKEN_EXPIRATION = '1m'; // Reduced to 1 minute for testing
const ACCESS_TOKEN_EXPIRATION = '1h'; // Restored to 1 hour for production
const REFRESH_TOKEN_EXPIRATION_DAYS = 7;

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
    const roleMap = {
      'ADMINISTRADOR': 1,
      'GERENTE': 2,
      'ASESOR': 3
    };
    const rol_id = roleMap[req.body.Rol.toUpperCase()] || null;

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
      'ADMINISTRADOR': 1,
      'GERENTE': 2,
      'ASESOR': 3
    };
    const rol_id = req.body.Rol ? roleMap[req.body.Rol.toUpperCase()] : null;

    const usuarioData = {
      correo: req.body.Correo,
      contrasena: req.body.Contraseña,
      asesor_id: req.body.id_asesor,
      rol_id: rol_id,
      nombre_usuario: req.body.NombreUsuario,
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
    const usuario = await usuarioService.getUsuarioWithAsesorByIdentifier(identifier);
    if (!usuario) {
      return res.status(401).json({ error: 'Invalid username/email or password' });
    }
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
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: ACCESS_TOKEN_EXPIRATION });

    // Create refresh token
    const refreshToken = jwt.sign(tokenPayload, process.env.JWT_REFRESH_SECRET, { expiresIn: `${REFRESH_TOKEN_EXPIRATION_DAYS}d` });
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + REFRESH_TOKEN_EXPIRATION_DAYS);
    await usuarioService.createRefreshToken(refreshToken, usuario.id, expiresAt);

    res.json({ token, refreshToken });
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

/**
 * Función para cerrar sesión y eliminar el refresh token.
 */
export const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }
  try {
    const deleted = await usuarioService.deleteRefreshToken(refreshToken);
    if (!deleted) {
      return res.status(404).json({ error: 'Refresh token not found' });
    }
    res.json({ message: 'Logout successful' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Función para refrescar el token de acceso usando el refresh token.
 */
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: 'Refresh token is required' });
  }
  try {
    const storedToken = await usuarioService.getRefreshToken(refreshToken);
    if (!storedToken) {
      return res.status(403).json({ error: 'Invalid refresh token' });
    }
    jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired refresh token' });
      }
      const tokenPayload = { id: decoded.id };
      const newAccessToken = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
      // Removed console log for new access token creation to clean logs
      res.json({ token: newAccessToken });
    });
  } catch (error) {
    console.error('Refresh token error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
