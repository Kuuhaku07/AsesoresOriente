import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFoundPage from '../components/NotFoundPage';
import ImageGallery from '../components/ImageGallery';
import Map from '../components/Map';
import SectionNavMenu from '../components/SectionNavMenu';
import { FaBed, FaBath, FaCar, FaRulerCombined, FaLayerGroup, FaCalendarAlt, FaCouch, FaSnowflake, FaMapMarkerAlt, FaUser } from 'react-icons/fa';
import '../styles/Inmuebles.css';

const Inmuebles = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [inmuebleData, setInmuebleData] = useState(null);

  useEffect(() => {
    const fetchInmuebleData = async () => {
      try {
        setLoading(true);
        setErrorStatus(null);

        const response = await fetch(`/api/inmueble/modificar/${id}`);
        if (!response.ok) {
          if (response.status === 404 || response.status === 500) {
            setErrorStatus(response.status);
            setLoading(false);
            return;
          }
          throw new Error('Error al cargar datos del inmueble');
        }

        const data = await response.json();
        setInmuebleData(data.inmuebleData);
      } catch (error) {
        console.error('Error fetching inmueble data:', error);
        setErrorStatus(500);
      } finally {
        setLoading(false);
      }
    };

    fetchInmuebleData();
  }, [id]);

  if (loading) {
    return (
      <PageTemplate title="Cargando inmueble...">
        <LoadingSpinner />
      </PageTemplate>
    );
  }

  if (errorStatus === 404) {
    return (
      <PageTemplate title="Inmueble no encontrado">
        <NotFoundPage message="El inmueble solicitado no fue encontrado." />
      </PageTemplate>
    );
  }

  if (errorStatus === 500) {
    return (
      <PageTemplate title="Error">
        <NotFoundPage message="Error al cargar el inmueble." />
      </PageTemplate>
    );
  }

  if (!inmuebleData) {
    return null;
  }

  const formatBoolean = (value) => (value ? 'Sí' : 'No');

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'DISPONIBLE': return '#4CAF50';
      case 'RESERVADO': return '#FFC107';
      case 'VENDIDO': return '#F44336';
      case 'NO_DISPONIBLE': return '#9E9E9E';
      default: return '#cccccc';
    }
  };

  
  return (
    <PageTemplate title={`${inmuebleData.titulo || 'Inmueble'}`}>
      <div className="inmueble-page-container">
        {/* Header Section */}
        <header className="inmueble-header">

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span 
              className="status-tag" 
              style={{ backgroundColor: getStatusColor(inmuebleData.estado_nombre) }}
            >
              {inmuebleData.estado_nombre || ''}
            </span>
            
            {inmuebleData.tipoNegocios?.map((tn) => (
              <span key={tn.tipoNegocioId} className="business-tag">
                {tn.nombre || ''}
              </span>
            ))}
            
            {inmuebleData.tipoNegocios?.length > 0 && (
              <span className="price-tag">
                {inmuebleData.tipoNegocios[0].precio} {inmuebleData.tipoNegocios[0].moneda}
              </span>
            )}
          </div>
        </header>

        {/* Image Gallery Section */}
        <section id="gallery" className="gallery-section">
          {inmuebleData.imagenes?.length > 0 ? (
            <ImageGallery
              images={inmuebleData.imagenes.map(img => ({
                ...img,
                preview: img.ruta || img.preview || '',
              }))}
              mode="display"
              labels={{ bannerSelector: true }}
            />
          ) : (
            <div className="info-card">
              <p>No hay imágenes disponibles.</p>
            </div>
          )}
        </section>

        {/* Combined Location and Map Section */}
        <section id="location-map" className="location-map-section">
          {/* Location Details */}
          <div className="info-card">
            <h2>Ubicación</h2>
            <table className="info-table">
              <tbody>
                <tr>
                  <td><FaMapMarkerAlt /></td>
                  <td>Dirección</td>
                  <td>{inmuebleData.direccion_exacta || 'No especificada'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>Zona</td>
                  <td>{inmuebleData.zona_nombre || 'No especificada'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>Ciudad</td>
                  <td>{inmuebleData.ciudad_nombre || 'No especificada'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>Estado</td>
                  <td>{inmuebleData.estado_nombre_ubicacion || 'No especificado'}</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          {/* Map */}
          <div className="info-card">
            <h2>Ubicación en el Mapa</h2>
            <div className="map-container">
              <Map 
                location={{
                  lat: inmuebleData.coordenadas ? parseFloat(inmuebleData.coordenadas.split(',')[0]) : 0,
                  lng: inmuebleData.coordenadas ? parseFloat(inmuebleData.coordenadas.split(',')[1]) : 0,
                }}
              />
            </div>
          </div>
        </section>

        {/* General Information Section */}
        <section id="general-info" className="info-card">
          <h2>Datos Generales</h2>
          <div className="general-info-grid">
            <table className="info-table">
              <tbody>
                <tr>
                  <td><FaLayerGroup /></td>
                  <td>Tipo</td>
                  <td>{inmuebleData.tipo_inmueble_nombre || 'No especificado'}</td>
                </tr>
                <tr>
                  <td><FaUser /></td>
                  <td>Asesor</td>
                  <td>{inmuebleData.asesor_nombre || 'No asignado'}</td>
                </tr>
                <tr>
                  <td><FaRulerCombined /></td>
                  <td>Área Construida</td>
                  <td>{inmuebleData.area_construida || '0'} m²</td>
                </tr>
                <tr>
                  <td><FaRulerCombined /></td>
                  <td>Área de Terreno</td>
                  <td>{inmuebleData.area_terreno || '0'} m²</td>
                </tr>
                <tr>
                  <td><FaBed /></td>
                  <td>Habitaciones</td>
                  <td>{inmuebleData.habitaciones || '0'}</td>
                </tr>
              </tbody>
            </table>
            
            <table className="info-table">
              <tbody>
                <tr>
                  <td><FaBath /></td>
                  <td>Baños</td>
                  <td>{inmuebleData.banos || '0'}</td>
                </tr>
                <tr>
                  <td><FaCar /></td>
                  <td>Estacionamientos</td>
                  <td>{inmuebleData.estacionamientos || '0'}</td>
                </tr>
                <tr>
                  <td><FaLayerGroup /></td>
                  <td>Niveles</td>
                  <td>{inmuebleData.niveles || '1'}</td>
                </tr>
                <tr>
                  <td><FaCalendarAlt /></td>
                  <td>Año de Construcción</td>
                  <td>{inmuebleData.ano_construccion || 'N/A'}</td>
                </tr>
                <tr>
                  <td><FaCouch /></td>
                  <td>Amueblado</td>
                  <td>{formatBoolean(inmuebleData.amueblado)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Additional Characteristics Section */}
        <section id="other-details" className="info-card">
          <h2>Características</h2>
          {inmuebleData.caracteristicas?.length > 0 ? (
            <ul className="characteristics-list">
              {inmuebleData.caracteristicas.map((carac) => (
                <li key={carac.caracteristicaId}>
                  {carac.nombre || 'Característica'} 
                  {carac.cantidad && ` (${carac.cantidad})`}
                </li>
              ))}
            </ul>
          ) : (
            <p>No hay características adicionales disponibles.</p>
          )}
        </section>

        <SectionNavMenu sections={[
          { id: 'gallery', label: 'Galería de Fotos' },
          { id: 'general-info', label: 'Datos Generales' },
          { id: 'location-map', label: 'Ubicación y Mapa' },
          { id: 'other-details', label: 'Características' },
        ]} />
      </div>
    </PageTemplate>
  );
};

export default Inmuebles;
