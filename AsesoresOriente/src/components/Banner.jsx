// src/components/Banner.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined,FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/Banner.css';

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'DISPONIBLE': return '#4CAF50';
    case 'RESERVADO': return '#FFC107';
    case 'VENDIDO': return '#F44336';
    case 'NO_DISPONIBLE': return '#9E9E9E';
    default: return '#cccccc';
  }
};

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
    <div className={`banner ${isTransitioning ? 'transitioning' : ''}`}>
      <div className="banner-image-container">
        <img 
          src={currentProperty.imageurl ? (currentProperty.imageurl.startsWith('http') || currentProperty.imageurl.startsWith('/uploads') ? currentProperty.imageurl : `/uploads${currentProperty.imageurl}`) : defaultImage} 
          alt={`Inmueble: ${currentProperty.name}`} 
          className="banner-image"
          onError={(e) => {
            e.target.src = defaultImage;
          }}
        />
      </div>

      <div className={`info-box ${isHovered ? 'hovered' : ''}`}>
        <div className="info-box-content">
          {/* Estado y Tipo juntos */}
          <div className="status-type-container">
            {currentProperty.status && (
              <div className="status-tag" style={{ backgroundColor: getStatusColor(currentProperty.status) }}>
                {currentProperty.status}
              </div>
            )}
            {currentProperty.businesstypes?.map((type, index) => (
              <span key={index} className={`status-tag ${type.toLowerCase()}`}>
                {type}
              </span>
            ))}
          </div>
          
          <h3>{currentProperty.name}</h3>
          
          {/* Ubicación */}
          {currentProperty.location && (
            <p className="property-location">
              <FaMapMarkerAlt /> {currentProperty.location}
            </p>
          )}
          
          <div className="property-tag-container">

            {/* Precio */}
            {currentProperty.price && (
              <span className="property-tag price-tag">
                {currentProperty.price}
              </span>
            )}
          </div>

          <div className="property-details">
            {currentProperty.size && (
              <div className="detail-item">
                <FaRulerCombined />
                <span>{currentProperty.size} m²</span>
              </div>
            )}
            {currentProperty.rooms && (
              <div className="detail-item">
                <FaBed />
                <span>{currentProperty.rooms} hab.</span>
              </div>
            )}
            {currentProperty.bathrooms && (
              <div className="detail-item">
                <FaBath />
                <span>{currentProperty.bathrooms} baños</span>
              </div>
            )}
          </div>
          
          <Link to={currentProperty.detailslink || '/'} className="btn-details-link">
            <button className="btn-details">
              Ver detalles
            </button>
          </Link>
        </div>
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
    </div>
  );
};

export default Banner;
