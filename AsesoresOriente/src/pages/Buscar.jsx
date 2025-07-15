import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PropertiesGrid from '../components/PropertiesGrid';
import MangoTemplate from '../components/MangoTemplate';

const Buscar = () => {
  const location = useLocation();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // Parse query parameters from URL
  const queryParams = new URLSearchParams(location.search);

  useEffect(() => {
    const fetchProperties = async () => {
      setLoading(true);
      try {
        // Build API URL with query params
        const apiUrl = '/api/inmueble/search?' + queryParams.toString();
        const response = await fetch(apiUrl);
        if (!response.ok) {
          throw new Error('Error fetching properties');
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [location.search]);

  return (
    <MangoTemplate>
      <h1>Resultados de búsqueda</h1>
      {loading ? (
        <p>Cargando propiedades...</p>
      ) : (
        <PropertiesGrid properties={properties} />
      )}
    </MangoTemplate>
  );
};

export default Buscar;
