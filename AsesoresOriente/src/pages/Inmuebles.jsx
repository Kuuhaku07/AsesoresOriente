import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import MangoTemplate from '../components/MangoTemplate';
import PageTitle from '../components/PageTitle';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFoundPage from '../components/NotFoundPage';
import ImageGallery from '../components/ImageGallery';
import Map from '../components/Map';
import SectionNavMenu from '../components/SectionNavMenu';
import { FaBed, FaBath,FaPhone,FaEnvelope, FaCar, FaRulerCombined, FaLayerGroup, FaCalendarAlt, FaCouch, FaSnowflake, FaMapMarkerAlt, FaUser, FaFacebookSquare, FaInstagram, FaTwitterSquare } from 'react-icons/fa';
import '../styles/Inmuebles.css';
import iconMap from '../utils/iconMap';
import DocumentList from '../components/DocumentList';
import { useAuth } from '../context/AuthContext';
import { verifyPermissions } from '../utils/permissionUtils';

const Inmuebles = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);
  const [inmuebleData, setInmuebleData] = useState(null);
  const [estadoCivilList, setEstadoCivilList] = useState([]);

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
        setEstadoCivilList(data.estadoCivil || []);
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
      <MangoTemplate >
        <PageTitle>{"Cargando inmueble..."}</PageTitle>
        <LoadingSpinner />
      </MangoTemplate>
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
    <MangoTemplate >
      <PageTitle 
      headerRight={user && (verifyPermissions(user, ['ADMINISTRADOR', 'GERENTE']) || user.id_asesor === inmuebleData.asesorId) ? (
        <a 
          href={`/modificar/${inmuebleData.id}`} 
          className="btn btn-primary google-maps-link"
          style={{ marginLeft: 'auto', textDecoration: 'none' }}
        >
          Editar
        </a>
      ) : null}
    >
      {inmuebleData.titulo || 'Inmueble'}
    </PageTitle>
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
            
            {inmuebleData.tipoNegocios?.map((tn) => (
              <span key={tn.id} className="business-tag">
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
              coordinates={inmuebleData.coordenadas || ''}
              interactive={false}
              height="300px"
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
                <td>{inmuebleData.asesorDetails ? `${inmuebleData.asesorDetails.nombre} ${inmuebleData.asesorDetails.apellido}` : (inmuebleData.asesor_nombre || 'No asignado')}</td>
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
                <tr>
                  <td><FaSnowflake /></td>
                  <td>Climatizado</td>
                  <td>{formatBoolean(inmuebleData.climatizado)}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Additional Characteristics Section */}
        <section id="other-details" className="info-card">
          <h2>Características</h2>
          {inmuebleData.caracteristicas?.length > 0 ? (
            <ul className="characteristics-list styled-list">
              {inmuebleData.caracteristicas.map((carac) => (
                <li key={carac.caracteristicaId} className="styled-list-item">
                  &#9632; {carac.nombre || 'Característica'} 
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
                src={inmuebleData.asesorDetails?.foto_perfil ? `/uploads/profile_pictures/${inmuebleData.asesorDetails.foto_perfil}` : (inmuebleData.asesor_foto_perfil || 'https://static.vecteezy.com/system/resources/thumbnails/003/337/584/small/default-avatar-photo-placeholder-profile-icon-vector.jpg')} 
                alt={`Foto de ${inmuebleData.asesorDetails ? inmuebleData.asesorDetails.nombre + ' ' + inmuebleData.asesorDetails.apellido : (inmuebleData.asesor_nombre || 'Asesor')}`} 
              />
            </div>
            <div className="contact-info">
              <p><FaUser style={{ marginRight: '8px' }} />{inmuebleData.asesorDetails ? `${inmuebleData.asesorDetails.nombre} ${inmuebleData.asesorDetails.apellido}` : (inmuebleData.asesor_nombre || 'No asignado')}</p>
              <p style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <span><FaEnvelope style={{ marginRight: '8px' }} />{inmuebleData.asesorDetails?.correo || inmuebleData.asesor_correo || 'No disponible'}</span>
                <span><FaPhone style={{ marginRight: '8px' }} />{inmuebleData.asesorDetails?.telefono || inmuebleData.asesor_telefono || 'No disponible'}</span>
              </p>
              <div className="social-links">
                {inmuebleData.asesorDetails?.redes?.map((red) => {
                  if (!red.url) return null;
                  let iconKey = red.icono;
                  if (iconKey && !iconKey.startsWith('fa-')) {
                    iconKey = 'fa-' + iconKey;
                  }
                  const IconComponent = iconMap[iconKey] || null;
                  if (!IconComponent) return null;
                  return (
                    <a key={red.id} href={red.url} target="_blank" rel="noopener noreferrer" aria-label={red.nombre}>
                      <IconComponent style={{ color: red.color || '#000' }} />
                    </a>
                  );
                })}
              </div>
             </div>
          </div>
        </section>
      </div>

      {/* Información del Inmueble Section - visible only if user logged in */}
      {(user && (verifyPermissions(user, ['ADMINISTRADOR', 'GERENTE']) || user.id_asesor === inmuebleData.asesorId)) && (
        <section className="info-card inmueble-info-section" style={{ display: 'flex', gap: '24px', marginTop: '24px' }}>
          {/* Left side - Propietario info */}
          <div className="propietario-info" style={{ flex: 1, flexBasis: '50%', maxWidth: '50%' }}>
            <h2>Datos del Propietario</h2>
            {inmuebleData.propietario ? (
              inmuebleData.propietarioTipo === 'persona' ? (
                <div>
                  <p><strong>Nombre:</strong> {inmuebleData.propietario.nombre} {inmuebleData.propietario.apellido || ''}</p>
                  <p><strong>Teléfono:</strong> {inmuebleData.propietario.telefono || 'No disponible'}</p>
                  <p><strong>Email:</strong> {inmuebleData.propietario.correo || 'No disponible'}</p>
                  <p><strong>Dirección:</strong> {inmuebleData.propietario.direccion || 'No disponible'}</p>
                  <p><strong>Estado Civil:</strong> {estadoCivilList.find(e => e.id === inmuebleData.propietario.estado_civil_id)?.nombre || 'No disponible'}</p>
                  <p><strong>Fecha de Nacimiento:</strong> {inmuebleData.propietario.fecha_nacimiento ? new Date(inmuebleData.propietario.fecha_nacimiento).toLocaleDateString() : 'No disponible'}</p>
                  <p><strong>Notas:</strong> {inmuebleData.propietario.notas || 'No disponible'}</p>
                </div>
              ) : (
                <div>
                  <p><strong>Nombre Empresa:</strong> {inmuebleData.propietario.nombre || 'No disponible'}</p>
                  <p><strong>RIF:</strong> {inmuebleData.propietario.rif || 'No disponible'}</p>
                  <p><strong>Teléfono:</strong> {inmuebleData.propietario.telefono || 'No disponible'}</p>
                  <p><strong>Email:</strong> {inmuebleData.propietario.correo || 'No disponible'}</p>
                  <p><strong>Dirección:</strong> {inmuebleData.propietario.direccion || 'No disponible'}</p>
                  <p><strong>Representante Legal:</strong> {inmuebleData.propietario.representante_legal || 'No disponible'}</p>
                  <p><strong>Documento Representante:</strong> {inmuebleData.propietario.documento_representante || 'No disponible'}</p>
                  <p><strong>Notas:</strong> {inmuebleData.propietario.notas || 'No disponible'}</p>
                </div>
              )
            ) : (
              <p>No hay datos del propietario disponibles.</p>
            )}
          </div>

          {/* Right side - Documentos list */}
          <div className="documentos-info" style={{ flex: 1, flexBasis: '50%', maxWidth: '50%' }}>
            <h2>Documentos</h2>
            {inmuebleData.documentos && inmuebleData.documentos.length > 0 ? (
              <DocumentList
                documents={inmuebleData.documentos.map(doc => {
                  const ext = (doc.ruta || '').split('.').pop().toLowerCase();
                  let mimeType = 'application/octet-stream';
                  if (ext === 'pdf') mimeType = 'application/pdf';
                  else if (ext === 'doc' || ext === 'docx') mimeType = 'application/msword';
                  else if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(ext)) mimeType = 'image/' + ext;
                  else if (ext === 'xls' || ext === 'xlsx') mimeType = 'application/vnd.ms-excel';
                  else if (ext === 'txt') mimeType = 'text/plain';

                  // Create a dummy file object with name and type for DocumentList
                  const file = {
                    name: doc.nombre || doc.nombreArchivo || `document.${ext}`,
                    type: mimeType,
                  };

                  return {
                    ...doc,
                    preview: doc.preview || doc.ruta || '',
                    downloadUrl: doc.ruta || doc.preview || '',
                    file,
                  };
                })}
                mode="view"
                containerHeight="400px"
              />
            ) : (
              <p>No hay documentos disponibles.</p>
            )}
          </div>
        </section>
      )}

    </MangoTemplate>
  );
};

export default Inmuebles;
