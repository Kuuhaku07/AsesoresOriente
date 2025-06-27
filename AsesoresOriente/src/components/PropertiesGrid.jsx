// src/components/PropertiesGrid.jsx
import React from 'react';
import PropertyCard from './PropertyCard';
import '../styles/PropertiesGrid.css';

const PropertiesGrid = ({ properties }) => {
  return (
    <div className="properties-grid">
      {properties.map(property => (
        <PropertyCard 
          key={property.id} 
          property={{
            ...property,
            rooms: property.rooms || property.bedrooms // Compatibilidad con ambas propiedades
          }} 
        />
      ))}
    </div>
  );
};

export default PropertiesGrid;
