import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';
import './ImageGallery.css';
import ImageViewerModal from './ImageViewerModal';

const ImageGallery = ({
  images,
  onChange,
  mode = 'edit',
  thumbnailSize = 150,
  labels = { portada: 'Portada', eliminar: 'Eliminar', tituloPlaceholder: 'Título', descripcionPlaceholder: 'Descripción' },
}) => {
  const [selectedPortada, setSelectedPortada] = useState(
    images.findIndex((img) => img.es_portada) >= 0 ? images.findIndex((img) => img.es_portada) : 0
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  const handlePortadaChange = (index) => {
    setSelectedPortada(index);
    const newImages = images.map((img, i) => ({
      ...img,
      es_portada: i === index,
    }));
    onChange(newImages);
  };

  const handleRemove = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    onChange(newImages);
    if (selectedPortada === index) {
      setSelectedPortada(0);
    } else if (selectedPortada > index) {
      setSelectedPortada(selectedPortada - 1);
    }
  };

  const handleTitleChange = (index, title) => {
    const newImages = images.map((img, i) =>
      i === index ? { ...img, titulo: title } : img
    );
    onChange(newImages);
  };

  const handleDescriptionChange = (index, descripcion) => {
    const newImages = images.map((img, i) =>
      i === index ? { ...img, descripcion } : img
    );
    onChange(newImages);
  };

  const openModal = (index) => {
    setModalImageIndex(index);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  if (mode === 'display') {
    return (
      <>
        <div className="image-gallery-display" style={{ display: 'flex', flexWrap: 'nowrap', gap: '10px', overflowX: 'auto', paddingBottom: '8px' }}>
          {images.map((img, index) => (
            <img
              key={index}
              src={img.preview || (img.file ? URL.createObjectURL(img.file) : '')}
              alt={img.titulo || `Imagen ${index + 1}`}
              className="image-gallery-thumbnail"
              onClick={() => openModal(index)}
              style={{
                cursor: 'pointer',
                border: img.es_portada ? '3px solid #007bff' : 'none',
                width: thumbnailSize,
                height: thumbnailSize,
                objectFit: 'cover',
                borderRadius: '4px',
              }}
            />
          ))}
        </div>
        <ImageViewerModal
          isOpen={modalOpen}
          onClose={closeModal}
          imageSrc={images[modalImageIndex]?.preview || (images[modalImageIndex]?.file ? URL.createObjectURL(images[modalImageIndex].file) : '')}
          altText={images[modalImageIndex]?.titulo || `Imagen ${modalImageIndex + 1}`}
          caption={images[modalImageIndex]?.titulo}
        />
      </>
    );
  }

  // edit mode UI with horizontal scroll
  return (
    <div className="image-gallery" style={{ display: 'flex', flexWrap: 'nowrap', gap: '16px', maxWidth: '100%', overflowX: 'auto', paddingBottom: '8px' }}>
      {images.map((img, index) => (
        <div key={index} className="image-item" style={{ minWidth: thumbnailSize, boxShadow: '0 4px 8px rgba(0,0,0,0.15)', backgroundColor: '#fff', borderRadius: '8px', padding: '12px', flexShrink: 0 }}>
          <img
            src={img.preview || (img.file ? URL.createObjectURL(img.file) : '')}
            alt={img.titulo || `Imagen ${index + 1}`}
            className={img.es_portada ? 'portada' : ''}
            style={{ width: '100%', height: thumbnailSize, objectFit: 'cover', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}
            onClick={() => openModal(index)}
          />
          <div className="image-controls" style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', alignItems: 'center' }}>
            <label htmlFor={`portada-radio-${index}`} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '600', color: '#444', cursor: 'pointer' }}>
              <input
                id={`portada-radio-${index}`}
                type="radio"
                name="portada"
                checked={selectedPortada === index}
                onChange={() => handlePortadaChange(index)}
                style={{ cursor: 'pointer' }}
              />
              {labels.portada}
            </label>
            <button type="button" onClick={() => handleRemove(index)} style={{ backgroundColor: 'transparent', border: 'none', padding: 0, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label={labels.eliminar}>
              <FaTrashAlt color="#dc3545" size={20} />
            </button>
          </div>
          <label htmlFor={`title-input-${index}`} style={{ display: 'block', marginTop: '8px', fontWeight: '600', color: '#333' }}>
            {labels.tituloPlaceholder}
          </label>
          <input
            id={`title-input-${index}`}
            type="text"
            placeholder={labels.tituloPlaceholder}
            value={img.titulo || ''}
            onChange={(e) => handleTitleChange(index, e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.95rem', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}
          />
          <label htmlFor={`description-textarea-${index}`} style={{ display: 'block', marginTop: '8px', fontWeight: '600', color: '#333' }}>
            {labels.descripcionPlaceholder}
          </label>
          <textarea
            id={`description-textarea-${index}`}
            placeholder={labels.descripcionPlaceholder}
            value={img.descripcion || ''}
            onChange={(e) => handleDescriptionChange(index, e.target.value)}
            style={{ width: '100%', boxSizing: 'border-box', padding: '6px 10px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '0.95rem', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", resize: 'vertical', minHeight: '60px' }}
          />
        </div>
      ))}
      <ImageViewerModal
        isOpen={modalOpen}
        onClose={closeModal}
        imageSrc={images[modalImageIndex]?.preview || (images[modalImageIndex]?.file ? URL.createObjectURL(images[modalImageIndex].file) : '')}
        altText={images[modalImageIndex]?.titulo || `Imagen ${modalImageIndex + 1}`}
        caption={images[modalImageIndex]?.titulo}
      />
    </div>
  );
};

ImageGallery.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      file: PropTypes.object,
      preview: PropTypes.string,
      es_portada: PropTypes.bool,
      titulo: PropTypes.string,
      descripcion: PropTypes.string,
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired,
  mode: PropTypes.oneOf(['edit', 'display']),
  thumbnailSize: PropTypes.number,
  labels: PropTypes.shape({
    portada: PropTypes.string,
    eliminar: PropTypes.string,
    tituloPlaceholder: PropTypes.string,
    descripcionPlaceholder: PropTypes.string,
  }),
};

export default ImageGallery;
