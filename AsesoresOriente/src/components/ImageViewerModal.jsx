import React from 'react';
import '../styles/ImageViewerModal.css';

const ImageViewerModal = ({ isOpen, onClose, imageSrc, altText }) => {
  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="image-viewer-overlay" onClick={handleOverlayClick}>
      <div className="image-viewer-content">
        <button className="image-viewer-close" onClick={onClose} aria-label="Close image viewer">&times;</button>
        <img src={imageSrc} alt={altText} className="image-viewer-img" />
      </div>
    </div>
  );
};

export default ImageViewerModal;
