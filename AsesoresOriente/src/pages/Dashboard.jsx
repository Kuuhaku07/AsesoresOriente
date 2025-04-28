// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu } from '../components/Menu';
import { Navigate } from 'react-router-dom';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();

  // Redirect to home if user is not logged in
  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Menu />
      <div className="dashboard">
        <h1>Panel de Control</h1>
        <div className="dashboard-content">
          {/* User information section */}
          <section className="user-info">
            {/* Use user.pfp for profile picture with fallback */}
            {user.pfp ? (
              <img src={`uploads/profile_pictures/${user.pfp}`} alt={user.name} className="user-avatar" />
            ) : (
              <div className="user-avatar-fallback">{user.name.charAt(0)}</div>
            )}
            <h2>Bienvenido, {user.name}</h2>
            <p>Rol: {user.role}</p>
            <p>Email: {user.email}</p>
          </section>

          {/* Placeholder for additional dashboard content */}
          <section className="dashboard-widgets">
            {/* Add widgets, stats, or other components here */}
            <p>Aquí puedes agregar widgets, estadísticas u otros componentes del dashboard.</p>
          </section>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
