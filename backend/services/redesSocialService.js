import db from '../db.js';

export const getAllRedesSociales = async () => {
  const result = await db.query(
    `SELECT id, nombre, icono FROM "RedSocial" ORDER BY nombre`
  );
  return result.rows;
};
