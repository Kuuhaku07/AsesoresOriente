import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import MangoTemplate from '../components/MangoTemplate';
import PageTitle from '../components/PageTitle';
import '../styles/Dashboard.css';
import ImageViewerModal from '../components/ImageViewerModal';
import PropertiesGrid from '../components/PropertiesGrid';


const Dashboard = () => {
  const { user } = useAuth();

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  const openImageViewer = () => {
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      if (!user || !user.id) {
        setProperties([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/inmueble/asesor/${user.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch properties');
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [user]);

  if (user === null) {
    return null; // or a loading spinner
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <MangoTemplate>
      <div className="dashboard-content">
        {/* User information section */}
        <section className="user-info">
          {user.pfp ? (
            <img
              src={`uploads/profile_pictures/${user.pfp}`}
              alt={user.name}
              className="user-avatar"
              onClick={openImageViewer}
              style={{ cursor: 'pointer' }}
            />
          ) : (
            <div className="user-avatar-fallback">{user.name.charAt(0)}</div>
          )}
          <h2>Bienvenido, {user.name}</h2>
        </section>


        {/* Dashboard widgets section */}
        <section className="dashboard-widgets">
          <h3>Estadísticas y Gráficos</h3>

        </section>
        
        {/* User properties section */}
        <section className="user-properties">
          <h3>Mis Inmuebles</h3>
          {loading ? (
            <p>Cargando propiedades...</p>
          ) : properties.length === 0 ? (
            <p>No tienes propiedades asignadas.</p>
          ) : (
            <PropertiesGrid properties={properties} />
          )}
        </section>
      </div>
      <ImageViewerModal
        isOpen={isImageViewerOpen}
        onClose={closeImageViewer}
        imageSrc={user && user.pfp ? `uploads/profile_pictures/${user.pfp}` : ''}
        altText={user ? user.name : 'Imagen de perfil'}
      />
    </MangoTemplate>
  );
};

export default Dashboard;
