import express from 'express';
import { getTablesAndSchemas, getAllRecords, createRecord, updateRecord, deleteRecord } from '../controllers/genericController.js';

const router = express.Router();

// GET /api/generic/tables - Get all tables and their schemas
router.get('/tables', getTablesAndSchemas);

// GET /api/generic/:table - Get all records from a table
router.get('/:table', getAllRecords);

// POST /api/generic/:table - Create a new record in a table
router.post('/:table', createRecord);

// PUT /api/generic/:table/:id - Update a record by id in a table
router.put('/:table/:id', updateRecord);

// DELETE /api/generic/:table/:id - Delete a record by id in a table
router.delete('/:table/:id', deleteRecord);

export default router;
