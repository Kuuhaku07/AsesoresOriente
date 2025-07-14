// src/pages/Dashboard.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import MangoTemplate from '../components/MangoTemplate';
import PageTitle from '../components/PageTitle';
import '../styles/Dashboard.css';
import ImageViewerModal from '../components/ImageViewerModal';

const Dashboard = () => {
  const { user } = useAuth();

  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);

  const openImageViewer = () => {
    setIsImageViewerOpen(true);
  };

  const closeImageViewer = () => {
    setIsImageViewerOpen(false);
  };

  // Show loading or null while user is being initialized
  if (user === null) {
    return null; // or a loading spinner
  }

  // Redirect to home if user is not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <MangoTemplate>

      <div className="dashboard-content">
        {/* User information section */}
        <section className="user-info">
          {/* Use user.pfp for profile picture with fallback */}
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

        {/* Placeholder for additional dashboard content */}
        <section className="dashboard-widgets">
          {/* Add widgets, stats, or other components here */}
          <p>Aquí puedes agregar widgets, estadísticas u otros componentes del dashboard.</p>
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
