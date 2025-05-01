import pool from '../db.js';


/**
 * Crea un nuevo asesor con los datos proporcionados.
 * Inserta un registro en la tabla Asesor y devuelve el asesor creado.
 */
export const createAsesor = async (asesor) => {
  const {
    nombre,
    apellido,
    cedula,
    telefono,
    correo,
    fecha_ingreso = new Date(),
    comision_base = 2.5,
    activo = true,
    especialidad = null,
    foto_perfil = null,
    direccion = null
  } = asesor;

  const result = await pool.query(
    `INSERT INTO "Asesor" 
    (nombre, apellido, cedula, telefono, correo, fecha_ingreso, comision_base, activo, especialidad, foto_perfil, direccion) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [nombre, apellido, cedula, telefono, correo, fecha_ingreso, comision_base, activo, especialidad, foto_perfil, direccion]
  );
  return result.rows[0];
};

/**
 * Obtiene un asesor por su ID.
 */
export const getAsesorById = async (id) => {
  const result = await pool.query('SELECT * FROM "Asesor" WHERE id = $1', [id]);
  return result.rows[0];
};

/**
 * Actualiza un asesor existente identificado por ID con los datos proporcionados.
 * Devuelve el asesor actualizado.
 */
export const updateAsesor = async (id, asesor) => {
  const {
    nombre,
    apellido,
    cedula,
    telefono,
    correo,
    fecha_ingreso,
    comision_base,
    activo,
    especialidad,
    foto_perfil,
    direccion
  } = asesor;

  const result = await pool.query(
    `UPDATE "Asesor" SET 
      nombre = $1, apellido = $2, cedula = $3, telefono = $4, correo = $5, fecha_ingreso = $6, 
      comision_base = $7, activo = $8, especialidad = $9, foto_perfil = $10, direccion = $11 
      WHERE id = $12 RETURNING *`,
    [nombre, apellido, cedula, telefono, correo, fecha_ingreso, comision_base, activo, especialidad, foto_perfil, direccion, id]
  );
  return result.rows[0];
};
