import React from 'react';
import Logo from '../assets/Logo.png'; // Import the logo
import '../styles/Menu.css'; 
export function Menu() {
    return (
        <nav className="menu">
            <div className="logo">
                <img src={Logo} alt="Logo" /> {/* Display the logo */}
            </div>
            <div className="menu-buttons">
                <button>Inicio</button>
                <button>Sobre Nosotros</button>
                <button>Nuestros Asesores</button>
                <button>Iniciar Sesion</button>
            </div>
        </nav>
    );
}
