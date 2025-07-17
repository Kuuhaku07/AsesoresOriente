import React, { useState, useEffect, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SearchBar.css';

const FilterRow = memo(({ label, name, value, onChange, options, children }) => {
  return (
    <div className="filter-row">
      <label className="filter-label">{label}</label>
      {options ? (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="filter-select"
          aria-label={label}
        >
          <option value="">{`Todos`}</option>
          {options.map((opt) => (
            <option key={opt.id} value={opt.nombre.toLowerCase()}>
              {opt.nombre}
            </option>
          ))}
        </select>
      ) : (
        children
      )}
    </div>
  );
});

const SearchBar = () => {
  const navigate = useNavigate();
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

  const [tipoInmuebles, setTipoInmuebles] = useState([]);
  const [tipoNegocios, setTipoNegocios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTipos = async () => {
      setLoading(true);
      setError(null);
      try {
        const [inmueblesRes, negociosRes] = await Promise.all([
          fetch('/api/inmueble/tipos'),
          fetch('/api/inmueble/tiponegocios')
        ]);
        if (!inmueblesRes.ok || !negociosRes.ok) {
          throw new Error('Error fetching tipos');
        }
        const inmueblesData = await inmueblesRes.json();
        const negociosData = await negociosRes.json();
        setTipoInmuebles(inmueblesData);
        setTipoNegocios(negociosData);
      } catch (error) {
        setError('Error fetching filter options');
        console.error('Error fetching tipos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTipos();
  }, []);

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();

    if (filters.location) {
      queryParams.append('q', filters.location);
    }
    if (filters.propertyType) {
      queryParams.append('propertyType', filters.propertyType);
    }
    if (filters.transactionType) {
      queryParams.append('transactionType', filters.transactionType);
    }
    if (filters.bedrooms) {
      queryParams.append('bedrooms', filters.bedrooms);
    }
    if (filters.bathrooms) {
      queryParams.append('bathrooms', filters.bathrooms);
    }
    if (filters.minPrice) {
      queryParams.append('minPrice', filters.minPrice);
    }
    if (filters.maxPrice) {
      queryParams.append('maxPrice', filters.maxPrice);
    }
    if (filters.estadoId) {
      queryParams.append('estadoId', filters.estadoId);
    }
    if (filters.ciudadId) {
      queryParams.append('ciudadId', filters.ciudadId);
    }
    if (filters.zonaId) {
      queryParams.append('zonaId', filters.zonaId);
    }

    navigate(`/buscar?${queryParams.toString()}`);
  }, [filters, navigate]);

  const clearFilters = () => {
    setFilters({
      location: '',
      propertyType: '',
      transactionType: '',
      bedrooms: '',
      bathrooms: '',
      minPrice: '',
      maxPrice: ''
    });
  };

  return (
    <div className="search-container">
      <form onSubmit={handleSubmit} className="search-form" aria-label="Search form">
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
              aria-label="Buscar por ubicación, ciudad o zona"
            />
          </div>
          <button
            type="button"
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
            aria-expanded={showFilters}
            aria-controls="filters-column"
          >
            {showFilters ? '▲ Menos filtros' : '▼ Más filtros'}
          </button>
          <button type="submit" className="search-button">
            Buscar
          </button>
          <button
            type="button"
            className="clear-filters-button"
            onClick={clearFilters}
            aria-label="Limpiar filtros"
          >
            Limpiar filtros
          </button>
        </div>

        {error && <div className="error-message" role="alert">{error}</div>}

        {/* Filtros desplegables */}
        {showFilters && (
          <div className="filters-column" id="filters-column">
            {loading ? (
              <div className="loading-message" role="status" aria-live="polite">
                Cargando opciones de filtro...
              </div>
            ) : (
              <>
                <FilterRow
                  label="Tipo de inmueble"
                  name="propertyType"
                  value={filters.propertyType}
                  onChange={handleChange}
                  options={tipoInmuebles}
                />
                <FilterRow
                  label="Tipo de negocio"
                  name="transactionType"
                  value={filters.transactionType}
                  onChange={handleChange}
                  options={tipoNegocios}
                />
                <FilterRow
                  label="Habitaciones"
                  name="bedrooms"
                  value={filters.bedrooms}
                  onChange={handleChange}
                  options={[
                    { id: 1, nombre: '1+' },
                    { id: 2, nombre: '2+' },
                    { id: 3, nombre: '3+' }
                  ]}
                />
                <FilterRow
                  label="Baños"
                  name="bathrooms"
                  value={filters.bathrooms}
                  onChange={handleChange}
                  options={[
                    { id: 1, nombre: '1+' },
                    { id: 2, nombre: '2+' }
                  ]}
                />
                <FilterRow label="Rango de precio" name="priceRange" value="" onChange={() => {}}>
                  <div className="price-range-row">
                    <input
                      type="number"
                      name="minPrice"
                      placeholder="Mínimo"
                      value={filters.minPrice}
                      onChange={handleChange}
                      className="price-input"
                      aria-label="Precio mínimo"
                    />
                    <span className="price-separator">-</span>
                    <input
                      type="number"
                      name="maxPrice"
                      placeholder="Máximo"
                      value={filters.maxPrice}
                      onChange={handleChange}
                      className="price-input"
                      aria-label="Precio máximo"
                    />
                  </div>
                </FilterRow>
              </>
            )}
          </div>
        )}
      </form>
    </div>
  );
};
export default SearchBar;
