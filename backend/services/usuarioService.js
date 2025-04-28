import pool from '../db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

/**
 * Obtiene todos los usuarios junto con información del asesor asociado.
 * Realiza una consulta JOIN entre las tablas Usuario y Asesor.
 */
export const getAllUsuarios = async () => {
  const result = await pool.query(
    `SELECT u.id as usuario_id, u."Correo", u."Rol", u."id_asesor",
            a."Nombre", a."Apellido", a."Cedula", a."Telefono", a."Pfp"
     FROM "Usuario" u
     JOIN "Asesor" a ON u."id_asesor" = a."id"`
  );
  return result.rows;
};

/**
 * Obtiene un usuario junto con información del asesor por correo electrónico.
 * Realiza una consulta JOIN filtrando por el correo del usuario.
 */
export const getUsuarioWithAsesorByCorreo = async (Correo) => {
  const result = await pool.query(
    `SELECT u.id, u."Correo", u."Rol", a."Nombre", a."Apellido", a."Pfp"
     FROM "Usuario" u
     JOIN "Asesor" a ON u."id_asesor" = a."id"
     WHERE u."Correo" = $1`,
    [Correo]
  );
  return result.rows[0];
};

/**
 * Obtiene un usuario por correo electrónico.
 */
export const getUsuarioByCorreo = async (Correo) => {
  const result = await pool.query('SELECT * FROM "Usuario" WHERE "Correo" = $1', [Correo]);
  return result.rows[0];
};

/**
 * Obtiene un usuario por su ID.
 */
export const getUsuarioById = async (id) => {
  const result = await pool.query('SELECT * FROM "Usuario" WHERE id = $1', [id]);
  return result.rows[0];
};

/**
 * Crea un nuevo usuario.
 * Hashea la contraseña antes de almacenarla en la base de datos.
 */
export const createUsuario = async (usuario) => {
  const { Correo, Contraseña, id_asesor, Rol } = usuario;
  const hashedPassword = await bcrypt.hash(Contraseña, SALT_ROUNDS);
  const result = await pool.query(
    'INSERT INTO "Usuario" ("Correo", "Contraseña", "id_asesor", "Rol") VALUES ($1, $2, $3, $4) RETURNING *',
    [Correo, hashedPassword, id_asesor, Rol]
  );
  return result.rows[0];
};

/**
 * Actualiza un usuario existente y su foto de perfil en la tabla Asesor.
 * Si se proporciona una nueva contraseña, la hashea antes de actualizar.
 * Maneja actualizaciones parciales sin sobrescribir con valores nulos.
 * Retorna el usuario actualizado junto con la información del asesor (incluyendo Pfp).
 */
export const updateUsuario = async (id, usuario) => {
  // Obtener usuario actual para valores por defecto
  const currentUsuario = await getUsuarioById(id);
  if (!currentUsuario) {
    return null;
  }

  const Correo = usuario.Correo ?? currentUsuario.Correo;
  const id_asesor = usuario.id_asesor ?? currentUsuario.id_asesor;
  const Rol = usuario.Rol ?? currentUsuario.Rol;

  let hashedPassword = currentUsuario.Contraseña;
  if (usuario.Contraseña) {
    hashedPassword = await bcrypt.hash(usuario.Contraseña, SALT_ROUNDS);
  }

  // Actualizar usuario
  await pool.query(
    'UPDATE "Usuario" SET "Correo" = $1, "Contraseña" = $2, "id_asesor" = $3, "Rol" = $4 WHERE id = $5',
    [Correo, hashedPassword, id_asesor, Rol, id]
  );

  // Actualizar foto de perfil en tabla Asesor si se proporciona Pfp
  if (usuario.Pfp && id_asesor) {
    await pool.query(
      'UPDATE "Asesor" SET "Pfp" = $1 WHERE id = $2',
      [usuario.Pfp, id_asesor]
    );
  }

  // Retornar usuario actualizado con info de asesor incluyendo Pfp
  const result = await pool.query(
    `SELECT u.id, u."Correo", u."Rol", u."id_asesor",
            a."Nombre", a."Apellido", a."Cedula", a."Telefono", a."Pfp"
     FROM "Usuario" u
     JOIN "Asesor" a ON u."id_asesor" = a."id"
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
