import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFoundPage from '../components/NotFoundPage';
import ImageGallery from '../components/ImageGallery';
import Map from '../components/Map';
import SectionNavMenu from '../components/SectionNavMenu';
import { FaBed, FaBath,FaPhone,FaEnvelope, FaCar, FaRulerCombined, FaLayerGroup, FaCalendarAlt, FaCouch, FaSnowflake, FaMapMarkerAlt, FaUser, FaFacebookSquare, FaInstagram, FaTwitterSquare } from 'react-icons/fa';
import '../styles/Inmuebles.css';

import { useAuth } from '../context/AuthContext';
import { verifyPermissions } from '../utils/permissionUtils';

const Inmuebles = () => {
  const { id } = useParams();
  const { user } = useAuth();
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
    <PageTemplate 
      title={`${inmuebleData.titulo || 'Inmueble'}`}
      headerRight={(
        <a 
          href={`/modificar/${inmuebleData.id}`} 
          className="btn btn-primary google-maps-link"
          style={{ marginLeft: 'auto', textDecoration: 'none' }}
        >
          Editar
        </a>
      )}
    >
      <div className="inmueble-page-container">
        {/* Header Section */}
        <div className="inmueble-header">
          <div>{inmuebleData.direccion_exacta || 'No especificada'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <span 
              className="status-tag" 
              style={{ backgroundColor: getStatusColor(inmuebleData.estado_nombre) }}
            >
              {inmuebleData.estado_nombre || ''}
            </span>
            
            {inmuebleData.tipoNegocios?.map((tn, index) => (
              <span key={tn.tipoNegocioId ?? index} className="business-tag">
                {tn.nombre || ''}
              </span>
            ))}
            
            {inmuebleData.tipoNegocios?.length > 0 && (
              <span className="price-tag">
                {inmuebleData.tipoNegocios[0].precio} {inmuebleData.tipoNegocios[0].moneda}
              </span>
            )}
          </div>
        </div>

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
                <tr>
                  <td></td>
                  <td>Referencia</td>
                  <td>{inmuebleData.referencia || 'No especificada'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td colSpan={2}>
                    <a 
                      href={`https://www.google.com/maps?q=${inmuebleData.coordenadas || ''}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn btn-primary google-maps-link"
                      style={{ padding: '6px 12px', borderRadius: '4px', display: 'inline-block', fontWeight: '600', textDecoration: 'none' }}
                    >
                      Ver en Google Maps
                    </a>
                  </td>
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
        {inmuebleData.descripcion && (
          <section className="info-card description-section">
            <h2>Descripción</h2>
            <p>{inmuebleData.descripcion}</p>
          </section>
        )}
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
          { id: 'contact', label: 'Contacto' },
        ]} />

        {/* Contact Section */}
        <section id="contact" className="info-card contact-section">
          <h2>Contacto</h2>
          <div className="contact-container">
            <div className="contact-photo">
              <img 
                src={inmuebleData.asesor_foto_perfil || 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg'} 
                alt={`Foto de ${inmuebleData.asesor_nombre || 'Asesor'}`} 
              />
            </div>
            <div className="contact-info">
              <p><FaUser style={{ marginRight: '8px' }} />{inmuebleData.asesor_nombre || 'No asignado'}</p>
              <p style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span><FaEnvelope style={{ marginRight: '8px' }} />{inmuebleData.asesor_correo || 'No disponible'}</span>
                <span><FaPhone style={{ marginRight: '8px' }} />{inmuebleData.asesor_telefono || 'No disponible'}</span>
              </p>
              <div className="social-links">
                {inmuebleData.asesor_facebook && (
                  <a href={inmuebleData.asesor_facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <FaFacebookSquare />
                  </a>
                )}
                {inmuebleData.asesor_instagram && (
                  <a href={inmuebleData.asesor_instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <FaInstagram />
                  </a>
                )}
                {inmuebleData.asesor_twitter && (
                  <a href={inmuebleData.asesor_twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <FaTwitterSquare />
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Información del Inmueble Section - visible only if user logged in */}
      {(user && (verifyPermissions(user, ['ADMINISTRADOR', 'GERENTE']) || user.id_asesor === inmuebleData.asesorId)) && (
        <section className="info-card inmueble-info-section" style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
          {/* Left side - Propietario info */}
          <div className="propietario-info" style={{ flex: 1 }}>
            <h2>Datos del Propietario</h2>
            {inmuebleData.propietario ? (
              <div>
                <p><strong>Nombre:</strong> {inmuebleData.propietario.nombre} {inmuebleData.propietario.apellido || ''}</p>
                <p><strong>Teléfono:</strong> {inmuebleData.propietario.telefono || 'No disponible'}</p>
                <p><strong>Email:</strong> {inmuebleData.propietario.correo || 'No disponible'}</p>
                <p><strong>Dirección:</strong> {inmuebleData.propietario.direccion || 'No disponible'}</p>
              </div>
            ) : (
              <p>No hay datos del propietario disponibles.</p>
            )}
          </div>

          {/* Right side - Documentos list */}
          <div className="documentos-info" style={{ flex: 1 }}>
            <h2>Documentos</h2>
            {inmuebleData.documentos && inmuebleData.documentos.length > 0 ? (
              <ul>
                {inmuebleData.documentos.map((doc) => (
                  <li key={doc.id || doc.nombre}>
                    <a href={doc.ruta} target="_blank" rel="noopener noreferrer">{doc.nombre || doc.nombreArchivo || 'Documento'}</a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No hay documentos disponibles.</p>
            )}
          </div>
        </section>
      )}

    </PageTemplate>
  );
};

export default Inmuebles;
