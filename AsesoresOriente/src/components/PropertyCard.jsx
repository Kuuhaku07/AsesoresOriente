// src/components/PropertyCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/PropertyCard.css';

const PropertyCard = ({ property }) => {
  return (
    <div className="property-card">
      <div className="property-header">
        <span className={`property-type ${property.type.toLowerCase()}`}>
          {property.type.toUpperCase()}
        </span>
        <h3 className="property-title">{property.name}</h3>
      </div>
      
      <div className="property-image-container">
        <img 
          src={property.imageUrl || '/img/default-property.jpg'} 
          alt={property.name}
          className="property-image"
          onError={(e) => {
            e.target.src = '/img/default-property.jpg';
          }}
        />
      </div>
      
      <div className="property-details">
        <div className="property-location">
          <span className="location-text">{property.location}</span>
          {property.size && <span className="size-text">{property.size} m²</span>}
        </div>
        
        <div className="property-features">
          {property.rooms && (
            <span className="feature">
              <span className="feature-icon">🛏️</span>
              {property.rooms} hab.
            </span>
          )}
          {property.bathrooms && (
            <span className="feature">
              <span className="feature-icon">🚿</span>
              {property.bathrooms} baños
            </span>
          )}
        </div>
        
        <div className="property-footer">
          <span className="property-price">
            {property.price}
          </span>
          <Link to={property.detailsLink || '#'} className="details-link">
            Ver detalles →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;