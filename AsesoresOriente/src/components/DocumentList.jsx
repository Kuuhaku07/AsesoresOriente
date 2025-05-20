import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FaTrashAlt, FaUpload, FaFileAlt, FaDownload } from 'react-icons/fa';
import './DocumentList.css';

const DocumentList = ({
  documents,
  onChange,
  mode = 'edit', // 'edit', 'view', 'list'
  containerHeight = '400px',
  labels = {
    upload: 'Subir documentos',
    eliminar: 'Eliminar',
    nombrePlaceholder: 'Nombre del documento',
  },
  onSelect, // new callback for selection
  onPreview, // new callback for preview
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
      // Limpiar la URL anterior si existe
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
      }
      
      setSelectedIndex(index);
      if (onSelect) {
        onSelect(index, documents[index]);
      }
    };


    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
      // Cleanup the preview URL when component unmounts or previewUrl changes
      return () => {
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
        }
      };
    }, [previewUrl]);

    const renderPreview = () => {
    if (selectedIndex === null || !documents[selectedIndex]) {
      return <div className="document-preview-empty">Seleccione un documento para previsualizar</div>;
    }

    const doc = documents[selectedIndex];
    const file = doc.file;

    if (onPreview) {
      onPreview(selectedIndex, doc);
    }

    if (!file) {
      return (
        <div className="document-preview-other" style={{ height: '100%' }}>
          <FaFileAlt size={64} />
          <p>{doc.nombre || doc.nombre_archivo}</p>
        </div>
      );
    }

    // Generar nueva URL si no hay preview en el doc y no hay URL actual
    if (!doc.preview && !previewUrl) {
      const newUrl = URL.createObjectURL(file);
      setPreviewUrl(newUrl);
    }

    const url = doc.preview || previewUrl;

    if (file.type === 'application/pdf') {
      return (
        <iframe
          src={url}
          title={doc.nombre || file.name}
          className="document-preview-iframe"
          style={{ height: '100%' }}
        />
      );
    }

    if (file.type.startsWith('image/')) {
      return (
        <div className="document-preview-other" style={{ height: '100%' }}>
          <img
            src={url}
            alt={doc.nombre || file.name}
            className="document-preview-image"
            style={{ height: '100%' }}
          />
        </div>
      );
    }

  return (
    <div className="document-preview-other" style={{ height: '100%' }}>
      <FaFileAlt size={64} />
      <p>{doc.nombre || file.name}</p>
    </div>
  );
};

  if (mode === 'list') {
    // List only mode: show list with download links, no preview, no editing
    return (
      <div className="document-list-listmode" role="list" style={{ maxHeight: containerHeight, minHeight: containerHeight }}>
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
      <div className="document-list-display" role="list" style={{ maxHeight: containerHeight, minHeight: containerHeight, height: containerHeight, display: 'flex' }}>
        <div className="document-list" style={{ maxHeight: containerHeight, minHeight: containerHeight, height: containerHeight, overflowY: 'auto' }}>
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
        <div className="document-preview-container" style={{ maxHeight: containerHeight, minHeight: containerHeight, height: containerHeight, flexShrink: 0, flexGrow: 1 }}>
          {renderPreview()}
        </div>
      </div>
    );
  }

  // Default: edit mode
  return (
    <div className={`document-list-edit-container ${dragOver ? 'drag-over' : ''}`} style={{ maxHeight: containerHeight, minHeight: containerHeight, height: containerHeight, display: 'flex' }}>
      <div
        className="document-list"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        aria-label="Lista de documentos con soporte para subir archivos"
        role="list"
        style={{ maxHeight: containerHeight, minHeight: containerHeight, height: containerHeight, overflowY: 'auto' }}
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
      <div className="document-preview-container" style={{ maxHeight: containerHeight, minHeight: containerHeight, height: containerHeight, flexShrink: 0, flexGrow: 1 }}>
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
  onSelect: PropTypes.func,
  onPreview: PropTypes.func,
};

export default DocumentList;
