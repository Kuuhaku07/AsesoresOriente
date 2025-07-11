import React from 'react';
import { Link } from 'react-router-dom';
import { FaBed, FaBath, FaRulerCombined,FaMapMarkerAlt } from 'react-icons/fa';
import '../styles/PropertyCard.css';

const getStatusColor = (status) => {
  switch (status?.toUpperCase()) {
    case 'DISPONIBLE': return '#4CAF50';
    case 'RESERVADO': return '#FFC107';
    case 'VENDIDO': return '#F44336';
    case 'NO_DISPONIBLE': return '#9E9E9E';
    default: return '#cccccc';
  }
};

const PropertyCard = ({ property, defaultImage = '/img/default-property.jpg' }) => {
  return (
    <div className="property-card">
      <div className="property-header">
        <h3 className="property-title">{property.name}</h3>
      </div>

      {/* Estado */}
      {property.status && (
      <div 
        className="status-header"
        style={{ backgroundColor: getStatusColor(property.status) }}
      >
        {property.status}
      </div>
    )}

      <div className="property-image-frame">
        <div className="property-image-container">
          <img 
            src={property.imageurl ? (property.imageurl.startsWith('http') || property.imageurl.startsWith('/uploads') ? property.imageurl : property.imageurl.startsWith('/img/') ? property.imageurl : `/uploads${property.imageurl}`) : defaultImage} 
            alt={property.name}
            className="property-image"
            onError={(e) => {
              e.target.src = defaultImage;
            }}
          />
        </div>
      </div>

      <div className="property-details">
        <div className="property-type-container">
          <span className={`property-type ${property.businesstypes && property.businesstypes.length > 0 ? property.businesstypes[0].toLowerCase() : ''}`}>
            {property.businesstypes && property.businesstypes.length > 0 ? property.businesstypes[0] : 'N/A'}
          </span>
        </div>
        {/* Ubicación */}
        {property.location && (
          <div className="property-location">
            <FaMapMarkerAlt /> {property.location}
          </div>
        )}

        <div className="property-metrics">
          <span className="size-badge">
            <FaRulerCombined /> {property.size} m²
          </span>
          <div className="features">
            <span className="feature">
              <FaBed /> {property.rooms}
            </span>
            <span className="feature-separator">|</span>
            <span className="feature">
              <FaBath /> {property.bathrooms}
            </span>
          </div>
        </div>



        <div className="property-footer">
          <span className="property-price">
            {property.price}
          </span>
          <Link to={property.detailslink || '#'} className="details-link">
            Ver detalles →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
