import React from 'react';
import Logo from '../assets/Logo.png'; // Import the logo
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import '../styles/Menu.css'; 

export function Menu() {
    return (
        <nav className="menu">
            <div className="logo">
                <img src={Logo} alt="Logo" /> {/* Display the logo */}
            </div>
            <div className="menu-buttons">
                <Link to="/"><button>Inicio</button></Link>
                <Link to="/about"><button>Sobre Nosotros</button></Link>
                <Link to="/"><button>Nuestros Asesores</button></Link>
                <Link to="/login"><button>Iniciar Sesion</button></Link> {/* Link to Login page */}
            </div>
        </nav>
    );
}
