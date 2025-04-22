import pool from '../db.js';

export const getAllItems = async () => {
  const result = await pool.query('SELECT * FROM sample_table');
  return result.rows;
};

export const getItemById = async (id) => {
  const result = await pool.query('SELECT * FROM sample_table WHERE id = $1', [id]);
  return result.rows[0];
};

export const createItem = async (item) => {
  const { name, description } = item;
  const result = await pool.query(
    'INSERT INTO sample_table (name, description) VALUES ($1, $2) RETURNING *',
    [name, description]
  );
  return result.rows[0];
};

export const updateItem = async (id, item) => {
  const { name, description } = item;
  const result = await pool.query(
    'UPDATE sample_table SET name = $1, description = $2 WHERE id = $3 RETURNING *',
    [name, description, id]
  );
  return result.rows[0];
};

export const deleteItem = async (id) => {
  const result = await pool.query('DELETE FROM sample_table WHERE id = $1', [id]);
  return result.rowCount > 0;
};
