import React, { useState, useEffect } from 'react';

/**
 * Dynamic CRUD component to manage any table in the database.
 * Fetches tables and schemas from backend and renders dynamic forms and lists.
 */
const DynamicCRUD = () => {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [schema, setSchema] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  // Fetch tables and schemas on mount
  useEffect(() => {
    const fetchTables = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/generic/tables');
        if (!response.ok) throw new Error('Failed to fetch tables');
        const data = await response.json();
        setTables(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTables();
  }, []);

  // When selectedTable changes, update schema and fetch records
  useEffect(() => {
    if (!selectedTable) {
      setSchema(null);
      setRecords([]);
      setFormData({});
      setIsEditing(false);
      return;
    }
    const tableSchema = tables.find(t => t.table === selectedTable);
    setSchema(tableSchema);
    fetchRecords(selectedTable);
    resetForm();
  }, [selectedTable, tables]);

  // Fetch records for selected table
  const fetchRecords = async (table) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/generic/${table}`);
      if (!response.ok) throw new Error('Failed to fetch records');
      const data = await response.json();
      setRecords(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes in form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Reset form
  const resetForm = () => {
    setFormData({});
    setIsEditing(false);
  };

  // Handle edit button click
  const handleEdit = (record) => {
    setFormData(record);
    setIsEditing(true);
  };

  // Handle delete button click
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/generic/${selectedTable}/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete record');
      await fetchRecords(selectedTable);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submit for create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/generic/${selectedTable}/${formData.id}` : `/api/generic/${selectedTable}`;
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) throw new Error('Failed to save record');
      await fetchRecords(selectedTable);
      resetForm();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Dynamic CRUD</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {loading && <p>Loading...</p>}

      <label htmlFor="table-select">Select Table:</label>
      <select
        id="table-select"
        value={selectedTable || ''}
        onChange={e => setSelectedTable(e.target.value)}
      >
        <option value="" disabled>Select a table</option>
        {tables.map(t => (
          <option key={t.table} value={t.table}>{t.table}</option>
        ))}
      </select>

      {schema && (
        <form onSubmit={handleSubmit}>
          {schema.columns.map(col => {
            // Skip serial primary key on create
            if (!isEditing && col.column_default && col.column_default.includes('nextval')) {
              return null;
            }
            const value = formData[col.column_name] || '';
            const inputType = col.data_type.includes('int') ? 'number' :
                              col.data_type === 'boolean' ? 'checkbox' :
                              col.data_type === 'date' ? 'date' : 'text';
            return (
              <div key={col.column_name}>
                <label htmlFor={col.column_name}>{col.column_name}:</label>
                <input
                  id={col.column_name}
                  name={col.column_name}
                  type={inputType}
                  value={inputType === 'checkbox' ? undefined : value}
                  checked={inputType === 'checkbox' ? value : undefined}
                  onChange={handleChange}
                  required={col.is_nullable === 'NO'}
                />
              </div>
            );
          })}
          <button type="submit" disabled={loading}>
            {isEditing ? 'Update' : 'Create'}
          </button>
          {isEditing && (
            <button type="button" onClick={resetForm} disabled={loading}>
              Cancel
            </button>
          )}
        </form>
      )}

      {records.length > 0 && (
        <table border="1" cellPadding="5" cellSpacing="0">
          <thead>
            <tr>
              {schema.columns.map(col => (
                <th key={col.column_name}>{col.column_name}</th>
              ))}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map(record => (
              <tr key={record.id || JSON.stringify(record)}>
                {schema.columns.map(col => (
                  <td key={col.column_name}>
                    {typeof record[col.column_name] === 'boolean'
                      ? (record[col.column_name] ? 'Yes' : 'No')
                      : record[col.column_name]}
                  </td>
                ))}
                <td>
                  <button onClick={() => handleEdit(record)} disabled={loading}>Edit</button>
                  <button onClick={() => handleDelete(record.id)} disabled={loading}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DynamicCRUD;
