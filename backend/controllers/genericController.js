import pool from '../db.js';

/**
 * Get list of all user tables and their columns with data types and constraints.
 * Returns an array of tables with their schema metadata.
 */
export const getTablesAndSchemas = async (req, res) => {
  try {
    // Query to get tables and columns info from information_schema
    const tablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    const tables = tablesResult.rows.map(row => row.table_name);

    const schemaPromises = tables.map(async (table) => {
      const columnsResult = await pool.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = $1
        ORDER BY ordinal_position;
      `, [table]);

      return {
        table,
        columns: columnsResult.rows
      };
    });

    const schemas = await Promise.all(schemaPromises);

    res.json(schemas);
  } catch (error) {
    console.error('Error fetching tables and schemas:', error);
    res.status(500).json({ error: 'Failed to fetch tables and schemas' });
  }
};

/**
 * Get all records from a specified table.
 */
export const getAllRecords = async (req, res) => {
  const { table } = req.params;
  try {
    // Validate table name to prevent SQL injection
    const validTablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    const validTables = validTablesResult.rows.map(row => row.table_name);
    if (!validTables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    const result = await pool.query(`SELECT * FROM "${table}" LIMIT 100`);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Failed to fetch records' });
  }
};

/**
 * Create a new record in the specified table.
 */
export const createRecord = async (req, res) => {
  const { table } = req.params;
  const data = req.body;
  try {
    // Validate table name
    const validTablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    const validTables = validTablesResult.rows.map(row => row.table_name);
    if (!validTables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    // Build query dynamically
    const columns = Object.keys(data);
    const values = Object.values(data);
    const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');
    const query = `INSERT INTO "${table}" (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).json({ error: 'Failed to create record' });
  }
};

/**
 * Update a record by id in the specified table.
 */
export const updateRecord = async (req, res) => {
  const { table, id } = req.params;
  const data = req.body;
  try {
    // Validate table name
    const validTablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    const validTables = validTablesResult.rows.map(row => row.table_name);
    if (!validTables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    // Build query dynamically
    const columns = Object.keys(data);
    const values = Object.values(data);
    const setClause = columns.map((col, i) => `"${col}" = $${i + 1}`).join(', ');
    const query = `UPDATE "${table}" SET ${setClause} WHERE id = $${columns.length + 1} RETURNING *`;

    const result = await pool.query(query, [...values, id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating record:', error);
    res.status(500).json({ error: 'Failed to update record' });
  }
};

/**
 * Delete a record by id in the specified table.
 */
export const deleteRecord = async (req, res) => {
  const { table, id } = req.params;
  try {
    // Validate table name
    const validTablesResult = await pool.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    const validTables = validTablesResult.rows.map(row => row.table_name);
    if (!validTables.includes(table)) {
      return res.status(400).json({ error: 'Invalid table name' });
    }

    const result = await pool.query(`DELETE FROM "${table}" WHERE id = $1 RETURNING *`, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Record not found' });
    }
    res.json({ message: 'Record deleted' });
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Failed to delete record' });
  }
};