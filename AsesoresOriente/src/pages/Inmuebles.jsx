import React, { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PageTemplate from '../components/PageTemplate';
import LoadingSpinner from '../components/LoadingSpinner';
import NotFoundPage from '../components/NotFoundPage';
import ImageGallery from '../components/ImageGallery';
import Map from '../components/Map';
import SectionNavMenu from '../components/SectionNavMenu';
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

  // Helper function to format boolean values
  const formatBoolean = (value) => (value ? 'Sí' : 'No');

  const sections = [
    { id: 'business-type-location', label: 'Tipo de Negocio y Ubicación' },
    { id: 'gallery', label: 'Galería de Fotos' },
    { id: 'general-info', label: 'Datos Generales' },
    { id: 'map-location', label: 'Ubicación en el Mapa' },
    { id: 'description', label: 'Descripción' },
    { id: 'other-details', label: 'Otros Detalles' },
  ];

  return (
    <PageTemplate title={`Inmueble: ${inmuebleData.titulo || ''}`}>
      <div className="inmueble-page-container">
        <SectionNavMenu sections={sections} />

        <main className="inmueble-main-content">
          <section id="business-type-location" className="business-type-location">
            {inmuebleData.tipoNegocios && inmuebleData.tipoNegocios.length > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '8px' }}>
                {inmuebleData.tipoNegocios.map((tn) => (
                  <span
                    key={tn.tipoNegocioId}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontWeight: '600',
                      fontSize: '0.9rem',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tn.nombre || ''}
                  </span>
                ))}
                {inmuebleData.tipoNegocios.map((tn) => (
                  <span
                    key={`price-${tn.tipoNegocioId}`}
                    style={{
                      fontWeight: '700',
                      fontSize: '1.2rem',
                      marginLeft: 'auto',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tn.precio} {tn.moneda}
                  </span>
                ))}
              </div>
            )}
            <p style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.95rem', color: '#555' }}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-geo-alt"
                viewBox="0 0 16 16"
              >
                <path d="M12.166 8.94c0 1.5-2.166 4.5-2.166 4.5s-2.166-3-2.166-4.5a2.166 2.166 0 1 1 4.332 0z" />
                <path d="M8 0a5.53 5.53 0 0 0-5.5 5.5c0 3.038 5.5 10.5 5.5 10.5s5.5-7.462 5.5-10.5A5.53 5.53 0 0 0 8 0zM8 7a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
              </svg>
              {inmuebleData.direccion_exacta || ''}
            </p>
          </section>

          <section id="gallery" className="gallery-section">
            {inmuebleData.imagenes && inmuebleData.imagenes.length > 0 ? (
              <ImageGallery
                images={inmuebleData.imagenes.map(img => ({
                  ...img,
                  preview: img.ruta || img.preview || '',
                }))}
                mode="display"
                labels={{ bannerSelector: true }}
              />
            ) : (
              <p>No hay imágenes disponibles.</p>
            )}
          </section>

          <section id="general-info" className="general-info">
            <h2>Datos Generales</h2>
            <p><strong>Tipo de Inmueble:</strong> {inmuebleData.tipo_inmueble_nombre || ''}</p>
            <p><strong>Estado del Inmueble:</strong> {inmuebleData.estado_nombre || ''}</p>
            <p><strong>Asesor:</strong> {inmuebleData.asesor_nombre || ''}</p>
            <p><strong>Área Construida:</strong> {inmuebleData.area_construida} m²</p>
            <p><strong>Área de Terreno:</strong> {inmuebleData.area_terreno} m²</p>
            <p><strong>Habitaciones:</strong> {inmuebleData.habitaciones}</p>
            <p><strong>Baños:</strong> {inmuebleData.banos}</p>
            <p><strong>Estacionamientos:</strong> {inmuebleData.estacionamientos}</p>
            <p><strong>Niveles:</strong> {inmuebleData.niveles}</p>
            <p><strong>Año de Construcción:</strong> {inmuebleData.ano_construccion || 'N/A'}</p>
            <p><strong>Amueblado:</strong> {formatBoolean(inmuebleData.amueblado)}</p>
            <p><strong>Climatizado:</strong> {formatBoolean(inmuebleData.climatizado)}</p>
          </section>

          <section id="map-location" className="map-location">
            <h2>Ubicación en el Mapa</h2>
            <Map 
              location={{
                lat: inmuebleData.coordenadas ? parseFloat(inmuebleData.coordenadas.split(',')[0]) : 0,
                lng: inmuebleData.coordenadas ? parseFloat(inmuebleData.coordenadas.split(',')[1]) : 0,
              }}
            />
          </section>

          <section id="description" className="description-section">
            <h2>Descripción</h2>
            <p>{inmuebleData.descripcion}</p>
          </section>

          <section id="other-details" className="other-details">
            <h2>Otros Detalles</h2>
            <p><strong>Estado:</strong> {inmuebleData.estado_nombre_ubicacion || ''}</p>
            <p><strong>Ciudad:</strong> {inmuebleData.ciudad_nombre || ''}</p>
            <p><strong>Zona:</strong> {inmuebleData.zona_nombre || ''}</p>
            <section className="characteristics">
              <h3>Características</h3>
              {inmuebleData.caracteristicas && inmuebleData.caracteristicas.length > 0 ? (
                <ul>
                  {inmuebleData.caracteristicas.map((carac) => (
                    <li key={carac.caracteristicaId}>
                      {carac.nombre || 'Característica'} {carac.cantidad ? `- Cantidad: ${carac.cantidad}` : ''}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay características disponibles.</p>
              )}
            </section>

            <section className="documents">
              <h3>Documentos</h3>
              {inmuebleData.documentos && inmuebleData.documentos.length > 0 ? (
                <ul>
                  {inmuebleData.documentos.map((doc) => (
                    <li key={doc.id}>
                      <a href={doc.ruta} target="_blank" rel="noopener noreferrer">
                        {doc.nombre_archivo || doc.nombre}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No hay documentos disponibles.</p>
              )}
            </section>
          </section>
        </main>
      </div>
    </PageTemplate>
  );
};

export default Inmuebles;
