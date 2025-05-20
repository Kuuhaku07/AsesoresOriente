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
  onSelect,
  onPreview,
}) => {
  const [dragOver, setDragOver] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(null);
  const fileInputRef = useRef(null);
  const previewUrlRef = useRef(null);
  const itemsRef = useRef([]);

  const handleRemove = (index) => {
    const newDocuments = documents.filter((_, i) => i !== index);
    onChange(newDocuments);
    if (selectedIndex === index) {
      setSelectedIndex(null);
    } else if (selectedIndex > index) {
      setSelectedIndex(selectedIndex - 1);
    }
    // Mover el foco al elemento anterior o siguiente
    if (focusedIndex === index) {
      const newFocusedIndex = Math.min(index, documents.length - 2);
      setFocusedIndex(newFocusedIndex >= 0 ? newFocusedIndex : null);
      setTimeout(() => {
        if (itemsRef.current[newFocusedIndex]) {
          itemsRef.current[newFocusedIndex].focus();
        }
      }, 0);
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
    // Enfocar el último elemento añadido
    setTimeout(() => {
      const newIndex = documents.length + newFiles.length - 1;
      if (itemsRef.current[newIndex]) {
        itemsRef.current[newIndex].focus();
        setFocusedIndex(newIndex);
      }
    }, 0);
  };

  const handleFileInputChange = (e) => {
    onFilesAdded(e.target.files);
    e.target.value = null;
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
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    
    setSelectedIndex(index);
    setFocusedIndex(index);
    if (onSelect) {
      onSelect(index, documents[index]);
    }
  };

  const handleKeyDown = (e, index) => {
    if (!documents.length) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        if (index > 0) {
          const newIndex = index - 1;
          setFocusedIndex(newIndex);
          itemsRef.current[newIndex]?.focus();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (index < documents.length - 1) {
          const newIndex = index + 1;
          setFocusedIndex(newIndex);
          itemsRef.current[newIndex]?.focus();
        }
        break;
      case 'Home':
        e.preventDefault();
        setFocusedIndex(0);
        itemsRef.current[0]?.focus();
        break;
      case 'End':
        e.preventDefault();
        setFocusedIndex(documents.length - 1);
        itemsRef.current[documents.length - 1]?.focus();
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        handleSelect(index);
        break;
      case 'Delete':
        if (mode === 'edit') {
          e.preventDefault();
          handleRemove(index);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = null;
    }
    setSelectedIndex(null);
    setFocusedIndex(null);
  }, [documents]);

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

    if (doc.preview) {
      return renderPreviewContent(doc.preview, doc, file);
    }

    if (!previewUrlRef.current) {
      previewUrlRef.current = URL.createObjectURL(file);
    }

    return renderPreviewContent(previewUrlRef.current, doc, file);
  };

  const renderPreviewContent = (url, doc, file) => {
    if (file.type === 'application/pdf') {
      return (
        <iframe
          src={url}
          title={doc.nombre || file.name || 'Documento PDF'}
          className="document-preview-iframe"
          style={{ height: '100%' }}
          aria-label={`Vista previa de ${doc.nombre || file.name || 'documento PDF'}`}
        />
      );
    }

    if (file.type.startsWith('image/')) {
      return (
        <div className="document-preview-other" style={{ height: '100%' }}>
          <img
            src={url}
            alt={doc.nombre || file.name || 'Imagen'}
            className="document-preview-image"
            style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }}
          />
        </div>
      );
    }

    return (
      <div className="document-preview-other" style={{ height: '100%' }}>
        <FaFileAlt size={64} />
        <p>{doc.nombre || file.name || 'Documento'}</p>
        <a
          href={url}
          download={doc.nombre || file.name}
          className="document-download-button"
          aria-label={`Descargar ${doc.nombre || file.name || 'documento'}`}
        >
          <FaDownload /> Descargar
        </a>
      </div>
    );
  };

  if (mode === 'list') {
    return (
      <div 
        className="document-list-listmode" 
        role="listbox" 
        aria-multiselectable="false"
        style={{ maxHeight: containerHeight, minHeight: containerHeight }}
      >
        {documents.map((doc, index) => {
          const file = doc.file;
          const url = file ? (doc.preview || URL.createObjectURL(file)) : '#';
          return (
            <div
              key={index}
              className={`document-item-display ${selectedIndex === index ? 'selected' : ''}`}
              role="option"
              aria-selected={selectedIndex === index}
              tabIndex={focusedIndex === index ? 0 : -1}
              ref={el => itemsRef.current[index] = el}
              onClick={() => handleSelect(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              title={doc.nombre || doc.nombre_archivo || (file && file.name)}
            >
              <a 
                href={url} 
                download={doc.nombre || (file && file.name)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="document-name-link"
                aria-label={`Descargar ${doc.nombre || (file && file.name) || 'documento'}`}
              >
                {doc.nombre || doc.nombre_archivo || (file && file.name)}
                <FaDownload className="document-download-icon" />
              </a>
            </div>
          );
        })}
      </div>
    );
  }

  if (mode === 'view') {
    return (
      <div 
        className="document-list-display" 
        style={{ 
          maxHeight: containerHeight, 
          minHeight: containerHeight, 
          height: containerHeight, 
          display: 'flex' 
        }}
      >
        <div 
          className="document-list" 
          role="listbox"
          aria-multiselectable="false"
          style={{ 
            maxHeight: containerHeight, 
            minHeight: containerHeight, 
            height: containerHeight, 
            overflowY: 'auto' 
          }}
        >
          {documents.map((doc, index) => (
            <div
              key={index}
              className={`document-item-display ${selectedIndex === index ? 'selected' : ''}`}
              role="option"
              aria-selected={selectedIndex === index}
              tabIndex={focusedIndex === index ? 0 : -1}
              ref={el => itemsRef.current[index] = el}
              onClick={() => handleSelect(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onFocus={() => setFocusedIndex(index)}
              title={doc.nombre || doc.nombre_archivo || (doc.file && doc.file.name)}
            >
              <span className="document-name">
                {doc.nombre || doc.nombre_archivo || (doc.file && doc.file.name)}
              </span>
              <a
                href={doc.file ? (doc.preview || URL.createObjectURL(doc.file)) : '#'}
                download={doc.nombre || (doc.file && doc.file.name)}
                onClick={(e) => e.stopPropagation()}
                className="document-download-button"
                aria-label={`Descargar ${doc.nombre || (doc.file && doc.file.name) || 'documento'}`}
              >
                <FaDownload />
              </a>
            </div>
          ))}
        </div>
        <div 
          className="document-preview-container" 
          style={{ 
            maxHeight: containerHeight, 
            minHeight: containerHeight, 
            height: containerHeight, 
            flexShrink: 0, 
            flexGrow: 1 
          }}
        >
          {renderPreview()}
        </div>
      </div>
    );
  }

  // Edit mode
  return (
    <div 
      className={`document-list-edit-container ${dragOver ? 'drag-over' : ''}`} 
      style={{ 
        maxHeight: containerHeight, 
        minHeight: containerHeight, 
        height: containerHeight, 
        display: 'flex' 
      }}
    >
      <div
        className="document-list"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        role="listbox"
        aria-multiselectable="false"
        style={{ 
          maxHeight: containerHeight, 
          minHeight: containerHeight, 
          height: containerHeight, 
          overflowY: 'auto' 
        }}
      >
        {documents.map((doc, index) => (
          <div
            key={index}
            className={`document-item ${selectedIndex === index ? 'selected' : ''}`}
            role="option"
            aria-selected={selectedIndex === index}
            tabIndex={focusedIndex === index ? 0 : -1}
            ref={el => itemsRef.current[index] = el}
            onClick={() => handleSelect(index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onFocus={() => setFocusedIndex(index)}
            title={doc.file ? doc.file.name : doc.nombre_archivo}
          >
            <span className="document-filename">
              {doc.file ? doc.file.name : doc.nombre_archivo}
            </span>
            <input
              type="text"
              placeholder={labels.nombrePlaceholder}
              value={doc.nombre || ''}
              onChange={(e) => handleNameChange(index, e.target.value)}
              aria-label={`Nombre del documento ${index + 1}`}
              onClick={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
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
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
          onKeyDown={(e) => { 
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
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
      <div 
        className="document-preview-container" 
        style={{ 
          maxHeight: containerHeight, 
          minHeight: containerHeight, 
          height: containerHeight, 
          flexShrink: 0, 
          flexGrow: 1 
        }}
      >
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
      preview: PropTypes.string,
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