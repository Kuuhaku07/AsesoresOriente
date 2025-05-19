import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaTrashAlt, FaUpload, FaFileAlt, FaDownload } from 'react-icons/fa';
import './DocumentList.css';

const DocumentList = ({
  documents,
  onChange,
  mode = 'edit', // 'edit', 'view', 'list'
  labels = {
    upload: 'Subir documentos',
    eliminar: 'Eliminar',
    nombrePlaceholder: 'Nombre del documento',
  },
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const fileInputRef = useRef(null);

  const handleRemove = (index) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    onChange(newDocuments);
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
  };

  const handleNameChange = (index, nombre) => {
    const newDocuments = documents.map((doc, i) =>
      i === index ? { ...doc, nombre } : doc
    );
    onChange(newDocuments);
  };

  const onFilesAdded = (files) => {
    const newFiles = Array.from(files).map(file => ({
      file,
      nombre: file.name,
    }));
    onChange([...documents, ...newFiles]);
  };

  const handleFileInputChange = (e) => {
    onFilesAdded(e.target.files);
    e.target.value = null; // reset input
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesAdded(e.dataTransfer.files);
      e.dataTransfer.clearData();
    }
  };

  const handleSelect = (index) => {
    setSelectedIndex(index);
  };

  const renderPreview = () => {
    if (selectedIndex === null || !documents[selectedIndex]) return <div className="document-preview-empty">Seleccione un documento para previsualizar</div>;

    const doc = documents[selectedIndex];
    const file = doc.file;

    if (file && file.type === 'application/pdf') {
      const url = doc.preview || URL.createObjectURL(file);
      return (
        <iframe
          src={url}
          title={doc.nombre || file.name}
          className="document-preview-iframe"
        />
      );
    }

    // For other file types, show an icon and file name
    return (
      <div className="document-preview-other">
        {file && file.type.startsWith('image/') ? (
          <img
            src={doc.preview || URL.createObjectURL(file)}
            alt={doc.nombre || file.name}
            className="document-preview-image"
          />
        ) : (
          <>
            <FaFileAlt size={64} />
            <p>{doc.nombre || (file && file.name)}</p>
          </>
        )}
      </div>
    );
  };

  if (mode === 'list') {
    // List only mode: show list with download links, no preview, no editing
    return (
      <div className="document-list-listmode" role="list">
        {documents.map((doc, index) => {
          const file = doc.file;
          const url = file ? (doc.preview || URL.createObjectURL(file)) : '#';
          return (
            <div
              key={index}
              className="document-item-display"
              role="listitem"
              title={doc.nombre || doc.nombre_archivo || (file && file.name)}
            >
              <a href={url} download={doc.nombre || (file && file.name)} target="_blank" rel="noopener noreferrer" className="document-name-link">
                {doc.nombre || doc.nombre_archivo || (file && file.name)}
              </a>
            </div>
          );
        })}
      </div>
    );
  }

  if (mode === 'view') {
    // View mode: show list with clickable items and preview, no editing or removing
    return (
      <div className="document-list-display" role="list">
        <div className="document-list">
          {documents.map((doc, index) => (
          <div
            key={index}
            className={`document-item-display ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => handleSelect(index)}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(index); }}
            aria-selected={selectedIndex === index}
            role="listitem"
            title={doc.nombre || doc.nombre_archivo || (doc.file && doc.file.name)}
          >
            <span className="document-name" >
              {doc.nombre || doc.nombre_archivo || (doc.file && doc.file.name)}
            </span>
            <a
              href={doc.file ? (doc.preview || URL.createObjectURL(doc.file)) : '#'}
              download={doc.nombre || (doc.file && doc.file.name)}
              onClick={(e) => e.stopPropagation()}
              className="document-download-button"
              aria-label={`Descargar ${doc.nombre || (doc.file && doc.file.name)}`}
              title={`Descargar ${doc.nombre || (doc.file && doc.file.name)}`}
            >
              <FaDownload />
            </a>
          </div>
          ))}
        </div>
        <div className="document-preview-container">
          {renderPreview()}
        </div>
      </div>
    );
  }

  // Default: edit mode
  return (
    <div className={`document-list-edit-container ${dragOver ? 'drag-over' : ''}`}>
      <div
        className="document-list"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label="Lista de documentos con soporte para subir archivos"
        role="list"
      >
        {documents.map((doc, index) => (
          <div
            key={index}
            className={`document-item ${selectedIndex === index ? 'selected' : ''}`}
            onClick={() => handleSelect(index)}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleSelect(index); }}
            aria-selected={selectedIndex === index}
            role="listitem"
            title={doc.file ? doc.file.name : doc.nombre_archivo}
          >
            <span className="document-filename" >
              {doc.file ? doc.file.name : doc.nombre_archivo}
            </span>
            <input
              type="text"
              placeholder={labels.nombrePlaceholder}
              value={doc.nombre || ''}
              onChange={(e) => handleNameChange(index, e.target.value)}
              aria-label={`Nombre del documento ${index + 1}`}
            />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleRemove(index); }}
              aria-label={`${labels.eliminar} documento ${index + 1}`}
              className="remove-button"
            >
              <FaTrashAlt />
            </button>
          </div>
        ))}
        <div
          className="document-upload-area"
          onClick={() => fileInputRef.current && fileInputRef.current.click()}
          tabIndex={0}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') fileInputRef.current && fileInputRef.current.click(); }}
          role="button"
          aria-label={labels.upload}
        >
          <FaUpload size={32} />
          <span>{labels.upload}</span>
          <input
            type="file"
            multiple
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileInputChange}
          />
        </div>
      </div>
      <div className="document-preview-container">
        {renderPreview()}
      </div>
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
  mode: PropTypes.oneOf(['edit', 'view', 'list']),
  labels: PropTypes.shape({
    upload: PropTypes.string,
    eliminar: PropTypes.string,
    nombrePlaceholder: PropTypes.string,
  }),
};

export default DocumentList;
