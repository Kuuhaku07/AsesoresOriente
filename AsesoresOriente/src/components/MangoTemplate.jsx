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
  const [profileDropdownSticky, setProfileDropdownSticky] = useState(false);
  const [showNosotrosDropdown, setShowNosotrosDropdown] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleProfileDropdown = () => {
    if (profileDropdownSticky) {
      setProfileDropdownSticky(false);
      setProfileDropdownVisible(false);
    } else {
      setProfileDropdownSticky(true);
      setProfileDropdownVisible(true);
    }
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

  // Keyboard accessibility handlers
  const handleKeyDownSidebarToggle = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleSidebar();
    }
  };

  const handleKeyDownProfileButton = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleProfileDropdown();
    }
  };

  const handleKeyDownNosotrosButton = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggleNosotrosDropdown();
    }
  };

  return (
    <div className={`mango-template ${sidebarVisible ? 'sidebar-visible' : 'sidebar-hidden'}`}>
      
      <div className="body-container">
        
        <aside className={`sidebar ${sidebarVisible ? 'visible' : 'hidden'}`} role="navigation" aria-label="Sidebar menu">
            <header className="header">
              <Link to="/" aria-label="Inicio">
                <img src={Logo} alt="Logo" className="logo" />
              </Link>
            </header>
          <div className="sidebar-header-menu-container">

            <nav className="mangomenu" role="menubar" aria-label="Menú principal">
              <ul>
                {!user ? (
                  <>
                    <li className="mangomenu-item" role="none">
                      <Link to="/vender" role="menuitem" tabIndex={0}>Vender</Link>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="mangomenu-item" role="none">
                      <Link to="/dashboard" role="menuitem" tabIndex={0}>Dashboard</Link>
                    </li>
                  </>
                )}
                <li 
                  className="mangomenu-item dropdown"
                  onMouseEnter={() => setShowNosotrosDropdown(true)}
                  onMouseLeave={() => setShowNosotrosDropdown(false)}
                  role="none"
                >
                  <button 
                    className="dropbtn" 
                    onClick={toggleNosotrosDropdown}
                    onKeyDown={handleKeyDownNosotrosButton}
                    aria-haspopup="true"
                    aria-expanded={showNosotrosDropdown}
                    aria-controls="nosotros-dropdown"
                    tabIndex={0}
                  >
                    Nosotros
                  </button>
                  {(showNosotrosDropdown) && (
                    <div 
                      className="dropdown-content"
                      id="nosotros-dropdown"
                      onMouseEnter={() => setShowNosotrosDropdown(true)}
                      onMouseLeave={() => setShowNosotrosDropdown(false)}
                      role="menu"
                    >
                      <Link to="/about" className="dropdown-link" role="menuitem" tabIndex={0}>Quienes somos</Link>
                      <Link to="/asesores" className="dropdown-link" role="menuitem" tabIndex={0}>Nuestros Asesores</Link>
                      <Link to="/formar-parte" className="dropdown-link" role="menuitem" tabIndex={0}>Formar parte del equipo</Link>
                    </div>
                  )}
                </li>
              </ul>
            </nav>
          </div>
        </aside>
        <div className="main-container">
          <div className="top-bar">
            <nav className="top-nav" role="navigation" aria-label="Barra superior">
              <div className="left-controls">
                <button 
                  className="sidebar-toggle" 
                  onClick={toggleSidebar} 
                  onKeyDown={handleKeyDownSidebarToggle}
                  aria-label="Toggle sidebar"
                  aria-pressed={sidebarVisible}
                  tabIndex={0}
                >
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
                            window.location.href = `/buscar?q=${encodeURIComponent(query)}`;
                          }
                        }
                      }}
                      aria-label="Buscar"
                    />
                  </div>
                )}
                <div className="nav-icons">
                  {showMessages && (
                    <button className="icon-button" aria-label="Messages" tabIndex={0}>
                      <Icons.FiMessageSquare />
                    </button>
                  )}
                  {showNotifications && (
                    <button className="icon-button" aria-label="Notifications" tabIndex={0}>
                      <Icons.FiBell />
                    </button>
                  )}
                </div>
                <div className="profile-menu"
                  onMouseEnter={() => {
                    setProfileDropdownVisible(true);
                  }}
                  onMouseLeave={() => {
                    if (!profileDropdownSticky) {
                      setProfileDropdownVisible(false);
                    }
                  }}
                >
                  {!user ? (
                    <>
                      <Link to="/login" className="profile-link" tabIndex={0}>Iniciar Sesión</Link>
                    </>
                  ) : (
                    <>
                      <button 
                        className="profile-button" 
                        onClick={toggleProfileDropdown}
                        onKeyDown={handleKeyDownProfileButton}
                        aria-haspopup="true"
                        aria-expanded={profileDropdownVisible}
                        aria-controls="profile-dropdown"
                        tabIndex={0}
                      >
                        {userPhoto ? (
                          <img 
                            src={`/uploads/profile_pictures/${userPhoto}`} 
                            alt="Profile" 
                            className="profile-photo" 
                            loading="lazy"
                            onError={(e) => { e.target.src = '/img/default-profile.png'; }}
                          />
                        ) : (
                          <div className="profile-photo-placeholder" tabIndex={-1}>
                            <Icons.FiUser />
                          </div>
                        )}
                        <span className="profile-email">{userName}</span>
                        <Icons.FiChevronDown className={`profile-chevron ${profileDropdownVisible ? 'open' : ''}`} />
                      </button>
                      {profileDropdownVisible && (
                        <div 
                          className="profile-dropdown"
                          id="profile-dropdown"
                          onMouseEnter={() => setProfileDropdownVisible(true)}
                          onMouseLeave={() => {
                            if (!profileDropdownSticky) {
                              setProfileDropdownVisible(false);
                            }
                          }}
                          role="menu"
                        >
                          <Link to="/perfil" className="dropdown-item" role="menuitem" tabIndex={0}>Perfil</Link>
                          {(user.role === 'GERENTE' || user.role === 'ADMINISTRADOR') && (
                            <Link to="/register" className="dropdown-item" role="menuitem" tabIndex={0}>Registrar Usuario</Link>
                          )}
                          <button className="dropdown-item" onClick={handleLogout} tabIndex={0}>Cerrar sesión</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </nav>
          </div>
          <main className="content" tabIndex={-1}>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default MangoTemplate;
