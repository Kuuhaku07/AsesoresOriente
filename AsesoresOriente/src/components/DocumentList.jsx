import React from 'react';
import PropTypes from 'prop-types';
import './DocumentList.css';

const DocumentList = ({ documents, onChange }) => {
  const handleRemove = (index) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    onChange(newDocuments);
  };

  const handleNameChange = (index, nombre) => {
    const newDocuments = documents.map((doc, i) =>
      i === index ? { ...doc, nombre } : doc
    );
    onChange(newDocuments);
  };

  return (
    <div className="document-list">
      {documents.map((doc, index) => (
        <div key={index} className="document-item">
          <span>{doc.file ? doc.file.name : doc.nombre_archivo}</span>
          <input
            type="text"
            placeholder="Nombre del documento"
            value={doc.nombre || ''}
            onChange={(e) => handleNameChange(index, e.target.value)}
          />
          <button type="button" onClick={() => handleRemove(index)}>Eliminar</button>
        </div>
      ))}
    </div>
  );
};

DocumentList.propTypes = {
  documents: PropTypes.arrayOf(
    PropTypes.shape({
      file: PropTypes.object,
      nombre: PropTypes.string,
      nombre_archivo: PropTypes.string,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
};

export default DocumentList;
