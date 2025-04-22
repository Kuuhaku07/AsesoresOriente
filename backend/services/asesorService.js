import pool from '../db.js';

export const createAsesor = async (asesor) => {
  const { Nombre, Apellido, Cedula, Telefono, Pfp } = asesor;
  const result = await pool.query(
    'INSERT INTO "Asesor" ("Nombre", "Apellido", "Cedula", "Telefono", "Pfp") VALUES ($1, $2, $3, $4, $5) RETURNING *',
    [Nombre, Apellido, Cedula, Telefono, Pfp]
  );
  return result.rows[0];
};

export const updateAsesor = async (id, asesor) => {
  const { Nombre, Apellido, Cedula, Telefono, Pfp } = asesor;
  const result = await pool.query(
    'UPDATE "Asesor" SET "Nombre" = $1, "Apellido" = $2, "Cedula" = $3, "Telefono" = $4, "Pfp" = $5 WHERE id = $6 RETURNING *',
    [Nombre, Apellido, Cedula, Telefono, Pfp, id]
  );
  return result.rows[0];
};
