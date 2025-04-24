import pool from '../db.js';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;


export const getAllUsuarios = async () => {
  const result = await pool.query(
    `SELECT u.id as usuario_id, u."Correo", u."Rol", u."id_asesor",
            a."Nombre", a."Apellido", a."Cedula", a."Telefono", a."Pfp"
     FROM "Usuario" u
     JOIN "Asesor" a ON u."id_asesor" = a."id"`
  );
  return result.rows;
};

export const getUsuarioById = async (id) => {
  const result = await pool.query('SELECT * FROM "Usuario" WHERE id = $1', [id]);
  return result.rows[0];
};

export const createUsuario = async (usuario) => {
  const { Correo, Contraseña, id_asesor, Rol } = usuario;
  const hashedPassword = await bcrypt.hash(Contraseña, SALT_ROUNDS);
  const result = await pool.query(
    'INSERT INTO "Usuario" ("Correo", "Contraseña", "id_asesor", "Rol") VALUES ($1, $2, $3, $4) RETURNING *',
    [Correo, hashedPassword, id_asesor, Rol]
  );
  return result.rows[0];
};

export const updateUsuario = async (id, usuario) => {
  const { Correo, Contraseña, id_asesor, Rol } = usuario;
  let hashedPassword = Contraseña;
  if (Contraseña) {
    hashedPassword = await bcrypt.hash(Contraseña, SALT_ROUNDS);
  }
  const result = await pool.query(
    'UPDATE "Usuario" SET "Correo" = $1, "Contraseña" = $2, "id_asesor" = $3, "Rol" = $4 WHERE id = $5 RETURNING *',
    [Correo, hashedPassword, id_asesor, Rol, id]
  );
  return result.rows[0];
};

export const deleteUsuario = async (id) => {
  const result = await pool.query('DELETE FROM "Usuario" WHERE id = $1', [id]);
  return result.rowCount > 0;
};
