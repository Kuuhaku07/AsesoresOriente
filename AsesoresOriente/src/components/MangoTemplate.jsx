import React, { useState } from 'react';
import './MangoTemplate.css';
import * as Icons from "../assets/icons";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from '../context/AuthContext';
import Logo from '../assets/Logo.png';

const MangoTemplate = ({ 
  children,
  activePath = "/",
  onMenuItemClick = (path) => console.log("Navigating to:", path),
  showSearch = true,
  showMessages = true,
  showNotifications = true
}) => {
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [profileDropdownVisible, setProfileDropdownVisible] = useState(false);
  const [showNosotrosDropdown, setShowNosotrosDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleProfileDropdown = () => {
    setProfileDropdownVisible(!profileDropdownVisible);
  };

  const toggleNosotrosDropdown = () => {
    setShowNosotrosDropdown(!showNosotrosDropdown);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/", { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userName = user ? user.name : 'Guest';
  const userPhoto = user ? user.pfp : null;

  return (
    <div className={`mango-template ${sidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
      
      <div className="body-container">
        
        <aside className={`sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
            <header className="header">
              <Link to="/">
                <img src={Logo} alt="Logo" className="logo" />
              </Link>
            </header>
          <div className="sidebar-header-menu-container">

            <nav className="mangomenu">
              <ul>
                                {!user ? (
                  <>
                    <li className="mangomenu-item">
                      <Link to="/vender">Vender</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="mangomenu-item">
                      <Link to="/dashboard">Dashboard</Link>
                    </li>
                    
                  </>
                )}
                <li 
                  className="mangomenu-item dropdown"
                  onMouseEnter={() => setShowNosotrosDropdown(true)}
                  onMouseLeave={() => setShowNosotrosDropdown(false)}
                >
                  <button className="dropbtn" onClick={toggleNosotrosDropdown}>
                    Nosotros
                  </button>
                  {(showNosotrosDropdown) && (
                    <div className="dropdown-content">
                      <Link to="/about" className="dropdown-link">Quienes somos</Link>
                      <Link to="/asesores" className="dropdown-link">Nuestros Asesores</Link>
                      <Link to="/formar-parte" className="dropdown-link">Formar parte del equipo</Link>
                    </div>
                  )}
                </li>


              </ul>
            </nav>
          </div>
        </aside>
        <div className="main-container">
          <div className="top-bar">
            <nav className="top-nav">
              <div className="left-controls">
                <button className="sidebar-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
                  <Icons.FiMenu />
                </button>
              </div>
              <div className="right-controls">
{showSearch && (
  <div className="search-container">
    <Icons.FiSearch className="search-icon" />
    <input
      type="text"
      className="search-input"
      placeholder="Search..."
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          const query = e.currentTarget.value.trim();
          if (query) {
            // Navigate to Buscar page with query param 'q'
            window.location.href = `/buscar?q=${encodeURIComponent(query)}`;
          }
        }
      }}
    />
  </div>
)}
                <div className="nav-icons">
                  {showMessages && (
                    <button className="icon-button" aria-label="Messages">
                      <Icons.FiMessageSquare />
                    </button>
                  )}
                  {showNotifications && (
                    <button className="icon-button" aria-label="Notifications">
                      <Icons.FiBell />
                    </button>
                  )}
                </div>
                <div className="profile-menu"
                  onMouseEnter={() => setProfileDropdownVisible(true)}
                  onMouseLeave={() => setProfileDropdownVisible(false)}
                >
                  {!user ? (
                    <>
                      <Link to="/login" className="profile-link">Iniciar Sesión</Link>
                    </>
                  ) : (
                    <>
                      <button className="profile-button" onClick={toggleProfileDropdown}>
                        {userPhoto ? (
                          <img src={`/uploads/profile_pictures/${userPhoto}`} alt="Profile" className="profile-photo" />
                        ) : (
                          <div className="profile-photo-placeholder">
                            <Icons.FiUser />
                          </div>
                        )}
                        <span className="profile-email">{userName}</span>
                        <Icons.FiChevronDown className={`profile-chevron ${profileDropdownVisible ? 'open' : ''}`} />
                      </button>
                      {profileDropdownVisible && (
                        <div className="profile-dropdown">
                          <Link to="/perfil" className="dropdown-item">Perfil</Link>
                          {(user.role === 'GERENTE' || user.role === 'ADMINISTRADOR') && (
                            <Link to="/register" className="dropdown-item">Registrar Usuario</Link>
                          )}
                          <button className="dropdown-item" onClick={handleLogout}>Cerrar sesión</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </nav>
          </div>
          <main className="content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );};

export default MangoTemplate
