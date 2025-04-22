import pool from '../db.js';

export const getAllUsuarios = async () => {
  const result = await pool.query('SELECT * FROM "Usuario"');
  return result.rows;
};

export const getUsuarioById = async (id) => {
  const result = await pool.query('SELECT * FROM "Usuario" WHERE id = $1', [id]);
  return result.rows[0];
};

export const createUsuario = async (usuario) => {
  const { Correo, Contraseña, id_asesor, Rol } = usuario;
  const result = await pool.query(
    'INSERT INTO "Usuario" (Correo, Contraseña, id_asesor, Rol) VALUES ($1, $2, $3, $4) RETURNING *',
    [Correo, Contraseña, id_asesor, Rol]
  );
  return result.rows[0];
};

export const updateUsuario = async (id, usuario) => {
  const { Correo, Contraseña, id_asesor, Rol } = usuario;
  const result = await pool.query(
    'UPDATE "Usuario" SET Correo = $1, Contraseña = $2, id_asesor = $3, Rol = $4 WHERE id = $5 RETURNING *',
    [Correo, Contraseña, id_asesor, Rol, id]
  );
  return result.rows[0];
};

export const deleteUsuario = async (id) => {
  const result = await pool.query('DELETE FROM "Usuario" WHERE id = $1', [id]);
  return result.rowCount > 0;
};
