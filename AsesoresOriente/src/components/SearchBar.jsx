import React, { useState } from 'react';
import '../styles/SearchBar.css';

const SearchBar = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    propertyType: '',
    transactionType: '',
    bedrooms: '',
    bathrooms: '',
    minPrice: '',
    maxPrice: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Filtros aplicados:', filters);
    // Lógica de búsqueda aquí
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form">
        {/* Fila superior - Búsqueda y botones */}
        <div className="search-top-row">
          <div className="search-input-wrapper">
            <input
              type="text"
              name="location"
              placeholder="🔍 Buscar por ubicación, ciudad o zona..."
              value={filters.location}
              onChange={handleChange}
              className="search-main-input"
            />
          </div>
          <button type="button" 
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? '▲ Menos filtros' : '▼ Más filtros'}
          </button>
          <button type="submit" className="search-button">
            Buscar
          </button>
        </div>

        {/* Filtros desplegables */}
        {showFilters && (
          <div className="filters-column">
            <div className="filter-row">
              <label className="filter-label">Tipo de inmueble</label>
              <select
                name="propertyType"
                value={filters.propertyType}
                onChange={handleChange}
                className="filter-select"
              >
                <option value="">Todos</option>
                <option value="casa">Casa</option>
                <option value="apartamento">Apartamento</option>
                <option value="local">Local</option>
              </select>
            </div>

            <div className="filter-row">
              <label className="filter-label">Tipo de negocio</label>
              <select
                name="transactionType"
                value={filters.transactionType}
                onChange={handleChange}
                className="filter-select"
              >
                <option value="">Todos</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
              </select>
            </div>

            <div className="filter-row">
              <label className="filter-label">Habitaciones</label>
              <select
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleChange}
                className="filter-select"
              >
                <option value="">Cualquiera</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
                <option value="3">3+</option>
              </select>
            </div>

            <div className="filter-row">
              <label className="filter-label">Baños</label>
              <select
                name="bathrooms"
                value={filters.bathrooms}
                onChange={handleChange}
                className="filter-select"
              >
                <option value="">Cualquiera</option>
                <option value="1">1+</option>
                <option value="2">2+</option>
              </select>
            </div>

            <div className="filter-row">
              <label className="filter-label">Rango de precio</label>
              <div className="price-range-row">
                <input
                  type="number"
                  name="minPrice"
                  placeholder="Mínimo"
                  value={filters.minPrice}
                  onChange={handleChange}
                  className="price-input"
                />
                <span className="price-separator">-</span>
                <input
                  type="number"
                  name="maxPrice"
                  placeholder="Máximo"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  className="price-input"
                />
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default SearchBar;