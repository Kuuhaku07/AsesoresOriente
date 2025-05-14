// src/components/Menu.jsx
import React, { useState } from 'react';
import Logo from '../assets/Logo.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Menu.css';

export function Menu() {
  const { user, logout } = useAuth();

  // State to control dropdown visibility
  const [showNosotrosDropdown, setShowNosotrosDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Toggle handlers for dropdowns
  const toggleNosotrosDropdown = () => {
    setShowNosotrosDropdown(!showNosotrosDropdown);
  };

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  return (
    <nav className="menu">
      <div className="logo">
        <Link to="/"><img src={Logo} alt="Logo" /></Link>
      </div>
      <div className="menu-buttons">
        {/* Dropdown menu "Nosotros" */}
        <div 
          className="dropdown" 
          onMouseEnter={() => setShowNosotrosDropdown(true)} 
          onMouseLeave={() => setShowNosotrosDropdown(false)}
        >
          <button className="dropbtn" onClick={toggleNosotrosDropdown}>
            Nosotros ▼
          </button>
          {showNosotrosDropdown && (
            <div className="dropdown-content">
              <Link to="/about">Quienes somos</Link>
              <Link to="/asesores">Nuestros Asesores</Link>
              <Link to="/formar-parte">Formar parte del equipo</Link>
            </div>
          )}
        </div>

        {/* Conditional rendering based on user login status */}
        {!user ? (
          <>
            <Link to="/vender"><button>Vender</button></Link>
            <Link to="/login"><button>Iniciar Sesión</button></Link>
          </>
        ) : (
          <>
            <Link to="/dashboard"><button>Dashboard</button></Link>
            {/* Profile dropdown with picture */}
            <div 
              className="dropdown profile-dropdown" 
              onMouseEnter={() => setShowProfileDropdown(true)} 
              onMouseLeave={() => setShowProfileDropdown(false)}
            >
              <button className="dropbtn profile-btn" onClick={toggleProfileDropdown}>
                {/* Show profile picture if available, else fallback text */}
                {user.pfp ? (
                  <img src={`/uploads/profile_pictures/${user.pfp}`} alt="Perfil" className="profile-pic" />
                ) : (
                  <span>{user.name}</span>
                )} ▼
              </button>
              {showProfileDropdown && (
                <div className="dropdown-content">
                  <Link to="/perfil">Perfil</Link>
                  {(user.role === 'GERENTE' || user.role === 'ADMINISTRADOR') && (
                    <Link to="/register">Registrar Usuario</Link>
                  )}
                  <a href="#" onClick={(e) => { e.preventDefault(); logout(); }} className="logout-btn">Cerrar sesión</a>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
