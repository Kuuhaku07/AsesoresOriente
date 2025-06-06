import pool from '../db.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';

const SALT_ROUNDS = 10;

/**
 * Obtiene todos los usuarios junto con información del asesor asociado y rol.
 * Realiza una consulta JOIN entre las tablas Usuario, Asesor y Rol.
 */
export const getAllUsuarios = async () => {
  const result = await pool.query(
    `SELECT u.id as usuario_id, u.correo as "Correo", u.nombre_usuario as "NombreUsuario", r.nombre as "Rol", u.asesor_id,
            a.nombre as "Nombre", a.apellido as "Apellido", a.cedula as "Cedula", a.telefono as "Telefono", a.foto_perfil as "Pfp"
     FROM "Usuario" u
     JOIN "Asesor" a ON u.asesor_id = a.id
     JOIN "Rol" r ON u.rol_id = r.id`
  );
  return result.rows;
};

/**
 * Obtiene un usuario junto con información del asesor y rol por correo electrónico.
 * Realiza una consulta JOIN filtrando por el correo del usuario.
 */
export const getUsuarioWithAsesorByCorreo = async (correo) => {
  const result = await pool.query(
    `SELECT u.id, u.correo as "Correo", u.nombre_usuario as "NombreUsuario", r.nombre as "Rol", a.nombre as "Nombre", a.apellido as "Apellido", a.foto_perfil as "Pfp"
     FROM "Usuario" u
     JOIN "Asesor" a ON u.asesor_id = a.id
     JOIN "Rol" r ON u.rol_id = r.id
     WHERE u.correo = $1`,
    [correo]
  );
  return result.rows[0];
};

export const getUsuarioWithAsesorByIdentifier = async (identifier) => {
  const result = await pool.query(
    `SELECT u.id, u.correo as "Correo", u.nombre_usuario as "NombreUsuario", r.nombre as "Rol", a.nombre as "Nombre", a.apellido as "Apellido", a.foto_perfil as "Pfp"
     FROM "Usuario" u
     JOIN "Asesor" a ON u.asesor_id = a.id
     JOIN "Rol" r ON u.rol_id = r.id
     WHERE u.correo = $1 OR u.nombre_usuario = $1`,
    [identifier]
  );
  return result.rows[0];
};

export const getUsuarioByIdentifier = async (identifier) => {
  const result = await pool.query(
    'SELECT * FROM "Usuario" WHERE correo = $1 OR nombre_usuario = $1',
    [identifier]
  );
  return result.rows[0];
};

/**
 * Obtiene un usuario por correo electrónico.
 */
export const getUsuarioByCorreo = async (correo) => {
  const result = await pool.query('SELECT * FROM "Usuario" WHERE correo = $1', [correo]);
  return result.rows[0];
};

/**
 * Obtiene un usuario por su ID.
 */
export const getUsuarioById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM "Usuario" WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    console.error('Error in getUsuarioById:', error);
    throw error;
  }
};

/**
 * Obtiene un usuario junto con información del asesor y rol por ID.
 */
export const getUsuarioWithAsesorById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.correo as "Correo", u.nombre_usuario as "NombreUsuario", r.nombre as "Rol", u.asesor_id,
              a.nombre as "Nombre", a.apellido as "Apellido", a.foto_perfil as "Pfp"
       FROM "Usuario" u
       JOIN "Asesor" a ON u.asesor_id = a.id
       JOIN "Rol" r ON u.rol_id = r.id
       WHERE u.id = $1`,
      [id]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in getUsuarioWithAsesorById:', error);
    throw error;
  }
};

/**
 * Crea un nuevo usuario.
 * Hashea la contraseña antes de almacenarla en la base de datos.
 */
export const createUsuario = async (usuario) => {
  const { correo, contrasena, asesor_id, rol_id, nombre_usuario } = usuario;
  const hashedPassword = await bcrypt.hash(contrasena, SALT_ROUNDS);
  const result = await pool.query(
    'INSERT INTO "Usuario" (correo, contrasena_hash, asesor_id, rol_id, nombre_usuario) VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [correo, hashedPassword, asesor_id, rol_id, nombre_usuario]
  );
  return result.rows[0];
};

/**
 * Actualiza un usuario existente y su foto de perfil en la tabla Asesor.
 * Si se proporciona una nueva contraseña, la hashea antes de actualizar.
 * Maneja actualizaciones parciales sin sobrescribir con valores nulos.
 * Retorna el usuario actualizado junto con la información del asesor (incluyendo foto de perfil).
 */
export const updateUsuario = async (id, usuario) => {
  // Obtener usuario actual para valores por defecto
  const currentUsuario = await getUsuarioById(id);
  if (!currentUsuario) {
    return null;
  }

  // Obtener el foto_perfil antiguo del asesor
  const asesorResult = await pool.query('SELECT foto_perfil FROM "Asesor" WHERE id = $1', [currentUsuario.asesor_id]);
  const oldPfp = asesorResult.rows[0]?.foto_perfil;

  const correo = usuario.correo ?? currentUsuario.correo;
  const asesor_id = usuario.asesor_id ?? currentUsuario.asesor_id;
  const rol_id = usuario.rol_id ?? currentUsuario.rol_id;
  const nombre_usuario = usuario.nombre_usuario ?? currentUsuario.nombre_usuario;

  let hashedPassword = currentUsuario.contrasena_hash;
  if (usuario.contrasena) {
    hashedPassword = await bcrypt.hash(usuario.contrasena, SALT_ROUNDS);
  }

  // Actualizar usuario incluyendo nombre_usuario
  await pool.query(
    'UPDATE "Usuario" SET correo = $1, contrasena_hash = $2, asesor_id = $3, rol_id = $4, nombre_usuario = $5 WHERE id = $6',
    [correo, hashedPassword, asesor_id, rol_id, nombre_usuario, id]
  );

  // Actualizar foto de perfil y otros campos en tabla Asesor si se proporciona asesor_id
  if (asesor_id) {
    const fieldsToUpdate = [];
    const values = [];
    let idx = 1;

    if (usuario.foto_perfil) {
      fieldsToUpdate.push(`foto_perfil = $${idx++}`);
      values.push(usuario.foto_perfil);
    }
    if (usuario.cedula) {
      fieldsToUpdate.push(`cedula = $${idx++}`);
      values.push(usuario.cedula);
    }
    if (usuario.telefono) {
      fieldsToUpdate.push(`telefono = $${idx++}`);
      values.push(usuario.telefono);
    }
    if (usuario.fecha_nacimiento) {
      fieldsToUpdate.push(`fecha_nacimiento = $${idx++}`);
      values.push(usuario.fecha_nacimiento);
    }
    if (usuario.especialidad) {
      fieldsToUpdate.push(`especialidad = $${idx++}`);
      values.push(usuario.especialidad);
    }
    if (usuario.direccion) {
      fieldsToUpdate.push(`direccion = $${idx++}`);
      values.push(usuario.direccion);
    }

    if (fieldsToUpdate.length > 0) {
      const query = `UPDATE "Asesor" SET ${fieldsToUpdate.join(', ')} WHERE id = $${idx}`;
      values.push(asesor_id);
      await pool.query(query, values);
    }

    // Borrar archivo antiguo si existe y es diferente al nuevo
    if (usuario.foto_perfil && oldPfp && oldPfp !== usuario.foto_perfil) {
      const uploadsDir = path.join(process.cwd(), 'uploads', 'profile_pictures');
      const oldPfpPath = path.join(uploadsDir, oldPfp);
      fs.unlink(oldPfpPath, (err) => {
        if (err) {
          console.error('Error deleting old profile picture:', err);
        } else {
          console.log('Old profile picture deleted:', oldPfpPath);
        }
      });
    }
  }

  // Retornar usuario actualizado con info de asesor incluyendo foto_perfil
  const result = await pool.query(
    `SELECT u.id, u.correo, r.nombre as rol, u.asesor_id,
            a.nombre, a.apellido, a.cedula, a.telefono, a.foto_perfil as pfp
     FROM "Usuario" u
     JOIN "Asesor" a ON u.asesor_id = a.id
     JOIN "Rol" r ON u.rol_id = r.id
     WHERE u.id = $1`,
    [id]
  );

  return result.rows[0];
};

/**
 * Elimina un usuario por su ID.
 */
export const deleteUsuario = async (id) => {
  const result = await pool.query('DELETE FROM "Usuario" WHERE id = $1', [id]);
  return result.rowCount > 0;
};

/**
 * Crea un refresh token en la base de datos.
 */
export const createRefreshToken = async (token, usuario_id, expiresAt) => {
  const result = await pool.query(
    'INSERT INTO "RefreshToken" (token, usuario_id, expires_at) VALUES ($1, $2, $3) RETURNING *',
    [token, usuario_id, expiresAt]
  );
  return result.rows[0];
};

/**
 * Obtiene un refresh token de la base de datos.
 */
export const getRefreshToken = async (token) => {
  const result = await pool.query(
    'SELECT * FROM "RefreshToken" WHERE token = $1',
    [token]
  );
  return result.rows[0];
};

/**
 * Elimina un refresh token de la base de datos.
 */
export const deleteRefreshToken = async (token) => {
  const result = await pool.query(
    'DELETE FROM "RefreshToken" WHERE token = $1',
    [token]
  );
  return result.rowCount > 0;
};

/**
 * Obtiene el perfil completo del usuario con todos los datos necesarios para la vista de perfil.
 * Incluye datos de Usuario, Asesor y Rol.
 */
export const getFullUsuarioProfileById = async (id) => {
  try {
    const result = await pool.query(
      `SELECT u.id, u.correo as "Correo", u.nombre_usuario as "NombreUsuario", u.activo as "Activo", u.ultimo_login as "UltimoLogin", u.fecha_creacion as "FechaCreacion",
              r.nombre as "Rol", u.asesor_id,
              a.nombre as "Nombre", a.apellido as "Apellido", a.cedula as "Cedula", a.telefono as "Telefono", a.foto_perfil as "Pfp",
              a.fecha_ingreso as "FechaIngreso", a.fecha_nacimiento as "FechaNacimiento", a.comision_base as "ComisionBase", a.especialidad as "Especialidad",
              a.direccion as "Direccion", a.fecha_creacion as "FechaCreacionAsesor"
       FROM "Usuario" u
       JOIN "Asesor" a ON u.asesor_id = a.id
       JOIN "Rol" r ON u.rol_id = r.id
       WHERE u.id = $1`,
      [id]
    );
    const user = result.rows[0];
    if (user) {
      // Remove sensitive fields
      delete user.contrasena_hash;
    }
    return user;
  } catch (error) {
    console.error('Error in getFullUsuarioProfileById:', error);
    throw error;
  }
};

/**
 * Cambia la contraseña de un usuario.
 * Verifica la contraseña actual antes de actualizar.
 */
export const changeUsuarioPassword = async (id, currentPassword, newPassword) => {
  try {
    const usuario = await pool.query('SELECT contrasena_hash FROM "Usuario" WHERE id = $1', [id]);
    if (usuario.rowCount === 0) {
      throw new Error('Usuario no encontrado');
    }
    const hashedPassword = usuario.rows[0].contrasena_hash;
    const passwordMatch = await bcrypt.compare(currentPassword, hashedPassword);
    if (!passwordMatch) {
      throw new Error('Contraseña actual incorrecta');
    }
    const newHashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    await pool.query('UPDATE "Usuario" SET contrasena_hash = $1 WHERE id = $2', [newHashedPassword, id]);
    return true;
  } catch (error) {
    console.error('Error in changeUsuarioPassword:', error);
    throw error;
  }
};

/**
 * Actualiza el campo ultimo_login del usuario con la fecha y hora actual.
 */
export const updateUltimoLogin = async (usuarioId) => {
  try {
    await pool.query(
      'UPDATE "Usuario" SET ultimo_login = NOW() WHERE id = $1',
      [usuarioId]
    );
  } catch (error) {
    console.error('Error updating ultimo_login:', error);
    throw error;
  }
};
