// src/components/PropertiesGrid.jsx
import React, { useState, useEffect, useRef } from 'react';
import PropertyCard from './PropertyCard';
import '../styles/PropertiesGrid.css';

const SkeletonCard = () => {
  return (
    <div className="property-card skeleton-card" aria-hidden="true">
      <div className="property-header skeleton-header"></div>
      <div className="property-image-frame skeleton-image"></div>
      <div className="property-details">
        <div className="property-type-container skeleton-text"></div>
        <div className="property-location skeleton-text"></div>
        <div className="property-metrics">
          <span className="size-badge skeleton-text"></span>
          <div className="features">
            <span className="feature skeleton-text"></span>
            <span className="feature-separator"></span>
            <span className="feature skeleton-text"></span>
          </div>
        </div>
        <div className="property-footer">
          <span className="property-price skeleton-text"></span>
          <span className="details-link skeleton-text"></span>
        </div>
      </div>
    </div>
  );
};

const PropertiesGrid = ({ properties, loading = false, singleRow = false, loadChunkSize = 10 }) => {
  const [displayedProperties, setDisplayedProperties] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    // Reset displayed properties when properties prop changes
    setDisplayedProperties(properties.slice(0, loadChunkSize));
  }, [properties, loadChunkSize]);

  const loadMore = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayedProperties(prev => {
        const nextProperties = properties.slice(prev.length, prev.length + loadChunkSize);
        return [...prev, ...nextProperties];
      });
      setIsLoadingMore(false);
    }, 500); // Simulate loading delay
  };

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    if (scrollHeight - scrollTop - clientHeight < 100) {
      if (displayedProperties.length < properties.length) {
        loadMore();
      }
    }
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, [displayedProperties, properties]);

  if (loading) {
    // Render 6 skeleton cards as placeholders
    return (
      <div className={`properties-grid${singleRow ? ' single-row' : ''}`} aria-busy="true" aria-live="polite">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  return (
    <div 
      className={`properties-grid${singleRow ? ' single-row' : ''}`} 
      ref={containerRef} 
      style={{ maxHeight: singleRow ? 'auto' : '600px', overflowY: singleRow ? 'visible' : 'auto' }}
      tabIndex={0}
      aria-label="Lista de propiedades"
    >
      {displayedProperties.map(property => (
        <PropertyCard 
          key={property.id} 
          property={{
            ...property,
            rooms: property.rooms || property.bedrooms // Compatibilidad con ambas propiedades
          }} 
        />
      ))}
      {isLoadingMore && (
        <div className="loading-indicator" aria-live="polite" aria-busy="true">
          Cargando más propiedades...
        </div>
      )}
    </div>
  );
};

export default PropertiesGrid;
