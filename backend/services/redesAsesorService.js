import db from '../db.js';

export const getRedesByAsesorId = async (asesorId) => {
  const result = await db.query(
    `SELECT ra.id, ra.asesor_id, ra.red_social_id, ra.url, ra.contenido, rs.nombre, rs.icono, rs.color
     FROM "RedAsesor" ra
     JOIN "RedSocial" rs ON ra.red_social_id = rs.id
     WHERE ra.asesor_id = $1`,
    [asesorId]
  );
  return result.rows;
};

export const existsRedAsesor = async (asesorId, red_social_id) => {
  const result = await db.query(
    `SELECT 1 FROM "RedAsesor" WHERE asesor_id = $1 AND red_social_id = $2`,
    [asesorId, red_social_id]
  );
  return result.rowCount > 0;
};

export const createRedAsesor = async ({ asesor_id, red_social_id, url, contenido }) => {
  const result = await db.query(
    `INSERT INTO "RedAsesor" (asesor_id, red_social_id, url, contenido)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [asesor_id, red_social_id, url, contenido]
  );
  return result.rows[0];
};

export const getRedAsesorById = async (id) => {
  const result = await db.query(
    `SELECT * FROM "RedAsesor" WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

export const updateRedAsesor = async (id, { red_social_id, url, contenido }) => {
  const result = await db.query(
    `UPDATE "RedAsesor"
     SET red_social_id = $1, url = $2, contenido = $3
     WHERE id = $4
     RETURNING *`,
    [red_social_id, url, contenido, id]
  );
  return result.rows[0];
};

export const deleteRedAsesor = async (id) => {
  await db.query(
    `DELETE FROM "RedAsesor" WHERE id = $1`,
    [id]
  );
};
