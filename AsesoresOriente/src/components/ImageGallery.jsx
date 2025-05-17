import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { FaTrashAlt } from 'react-icons/fa';
import './ImageGallery.css';
import ImageViewerModal from './ImageViewerModal';

const ImageGallery = ({
  images,
  onChange,
  mode = 'edit',
  thumbnailSize = 150,
  labels = { portada: 'Portada', eliminar: 'Eliminar', tituloPlaceholder: 'Título', descripcionPlaceholder: 'Descripción', bannerSelector: false },
}) => {
  const [selectedPortada, setSelectedPortada] = useState(
    images.findIndex((img) => img.es_portada) >= 0 ? images.findIndex((img) => img.es_portada) : 0
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bannerDimensions, setBannerDimensions] = useState({ width: 0, height: 0 });
  const bannerRef = useRef(null);

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
    if (bannerIndex === index) {
      setBannerIndex(0);
    } else if (bannerIndex > index) {
      setBannerIndex(bannerIndex - 1);
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

  const selectBannerImage = (index) => {
    setBannerIndex(index);
  };

  // Effect to update banner image natural dimensions
  useEffect(() => {
    if (!images[bannerIndex]) return;
    const img = new Image();
    img.src = images[bannerIndex].preview || (images[bannerIndex].file ? URL.createObjectURL(images[bannerIndex].file) : '');
    img.onload = () => {
      setBannerDimensions({ width: img.naturalWidth, height: img.naturalHeight });
    };
  }, [bannerIndex, images]);

  if (mode === 'display') {
    if (labels.bannerSelector) {
      // Calculate container height based on image aspect ratio, with min and max height limits
      const containerWidth = bannerRef.current ? bannerRef.current.clientWidth : 800;
      let containerHeight = 400; // default min height
      if (bannerDimensions.width && bannerDimensions.height) {
        const aspectRatio = bannerDimensions.width / bannerDimensions.height;
        containerHeight = Math.min(Math.max(containerWidth / aspectRatio, 400), 700);
      }

      return (
        <>
          <div
            className="banner-image-container"
            ref={bannerRef}
            style={{
              width: '100%',
              height: containerHeight,
              marginBottom: '12px',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '8px',
              backgroundColor: '#f0f0f0',
            }}
          >
            <img
              src={images[bannerIndex]?.preview || (images[bannerIndex]?.file ? URL.createObjectURL(images[bannerIndex].file) : '')}
              alt={images[bannerIndex]?.titulo || `Banner Image ${bannerIndex + 1}`}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                width: 'auto',
                height: 'auto',
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                cursor: 'pointer',
              }}
              onClick={() => openModal(bannerIndex)}
            />
            <div style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img.preview || (img.file ? URL.createObjectURL(img.file) : '')}
                  alt={img.titulo || `Thumbnail ${index + 1}`}
                  style={{
                    width: 60,
                    height: 60,
                    objectFit: 'cover',
                    borderRadius: '4px',
                    border: bannerIndex === index ? '3px solid #007bff' : '2px solid #ccc',
                    cursor: 'pointer',
                  }}
                  onClick={() => selectBannerImage(index)}
                />
              ))}
            </div>
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

    // existing display modes here (unchanged)
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

  // edit mode UI with horizontal scroll (unchanged)
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
    bannerSelector: PropTypes.bool,
  }),
};

export default ImageGallery;
