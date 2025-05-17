import React, { useEffect } from 'react';
import '../styles/ImageViewerModal.css';

const ImageViewerModal = ({ isOpen, onClose, imageSrc, altText, caption }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

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
        {caption && <div className="image-viewer-caption">{caption}</div>}
      </div>
    </div>
  );
};

export default ImageViewerModal;
