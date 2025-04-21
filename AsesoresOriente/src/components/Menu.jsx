// src/components/Menu.jsx
import React from 'react';
import Logo from '../assets/Logo.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Menu.css';

export function Menu() {
  const { user, logout } = useAuth();

  return (
    <nav className="menu">
      <div className="logo">
        <Link to="/"><img src={Logo} alt="Logo" /></Link>
      </div>
      <div className="menu-buttons">
        <Link to="/"><button>Inicio</button></Link>
        <Link to="/about"><button>Sobre Nosotros</button></Link>
        {user ? (
          <>
            <span className="user-greeting">Hola, {user.name}</span>
            <button onClick={logout}>Cerrar Sesión</button>
          </>
        ) : (
          <Link to="/login"><button>Iniciar Sesión</button></Link>
        )}
      </div>
    </nav>
  );
}