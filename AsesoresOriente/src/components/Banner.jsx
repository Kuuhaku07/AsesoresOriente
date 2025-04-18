// src/components/Banner.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Banner.css';

const Banner = ({ 
  properties = [], 
  autoPlay = true, 
  interval = 5000,
  defaultImage = '/img/default-property.jpg'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const navigateBanner = (direction) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentIndex(prev => {
        if (direction === 'prev') {
          return prev === 0 ? properties.length - 1 : prev - 1;
        } else {
          return prev === properties.length - 1 ? 0 : prev + 1;
        }
      });
      setIsTransitioning(false);
    }, 500);
  };

  const goToPrev = () => navigateBanner('prev');
  const goToNext = () => navigateBanner('next');

  useEffect(() => {
    if (!autoPlay || properties.length <= 1) return;
    const timer = setInterval(goToNext, interval);
    return () => clearInterval(timer);
  }, [currentIndex, properties]);

  if (properties.length === 0) {
    return (
      <div className="banner-placeholder">
        <img 
          src={defaultImage} 
          alt="No hay inmuebles destacados" 
          className="banner-image"
        />
        <div className="info-box">
          <h3>No hay propiedades disponibles</h3>
          <p>Pronto tendremos nuevas opciones para ti</p>
        </div>
      </div>
    );
  }

  const currentProperty = properties[currentIndex];

  return (
    <div 
      className={`banner ${isTransitioning ? 'transitioning' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="banner-image-container">
        <img 
          src={currentProperty.imageUrl || defaultImage} 
          alt={`Inmueble: ${currentProperty.name}`} 
          className="banner-image"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>
      
      <div className="arrow left-arrow" onClick={goToPrev}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
        </svg>
      </div>
      
      <div className="arrow right-arrow" onClick={goToNext}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
        </svg>
      </div>

      <div className={`info-box ${isHovered ? 'hovered' : ''}`}>
        <div className="info-box-content">
          <h3>{currentProperty.name}</h3>
          <div className="property-tag-container">
            <span className={`property-tag ${currentProperty.type.toLowerCase()}`}>
              {currentProperty.type}
            </span>
          </div>
          
          <div className="property-details">
            {currentProperty.size && (
              <div className="detail-item">
                <i className="icon-area" style={{ 
                  backgroundImage: "url('/img/icons/area.svg')",
                  filter: "brightness(0) invert(1)"
                }}></i>
                <span>{currentProperty.size} m²</span>
              </div>
            )}
            {currentProperty.rooms && (
              <div className="detail-item">
                <i className="icon-bed" style={{ 
                  backgroundImage: "url('/img/icons/bed.svg')",
                  filter: "brightness(0) invert(1)"
                }}></i>
                <span>{currentProperty.rooms} hab.</span>
              </div>
            )}
            {currentProperty.bathrooms && (
              <div className="detail-item">
                <i className="icon-bath" style={{ 
                  backgroundImage: "url('/img/icons/bath.svg')",
                  filter: "brightness(0) invert(1)"
                }}></i>
                <span>{currentProperty.bathrooms} baños</span>
              </div>
            )}
          </div>
          
          <Link 
            to={currentProperty.detailsLink || '/'} 
            className="btn-details-link"
          >
            <button className="btn-details">
              Ver detalles 
              <i className="icon-arrow" style={{ 
                backgroundImage: "url('/img/icons/arrow-right.svg')",
                filter: "brightness(0) invert(1)"
              }}></i>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;