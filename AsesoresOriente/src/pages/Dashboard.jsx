// src/pages/Dashboard.jsx
import React from 'react';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard">
      <h1>Panel de Control</h1>
      {user && (
        <div className="user-info">
          <img src={user.avatar} alt={user.name} className="user-avatar" />
          <h2>Bienvenido, {user.name}</h2>
          <p>Rol: {user.role}</p>
          <p>Email: {user.email}</p>
        </div>
      )}
      {/* Resto del contenido del dashboard */}
    </div>
  );
};

export default Dashboard;