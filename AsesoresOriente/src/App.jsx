import React from 'react'; 
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Import routing components
import './styles/index.css';

import { AuthProvider } from './context/AuthContext';
import Home from './pages/Home'; // Import Home page
import About from './pages/About'; // Import About page
import Login from './pages/Login'; // Import Login page
import Perfil from './pages/Perfil'; // Import Perfil page
import Buscar from './pages/Buscar'; // Import Buscar page
import Detalle from './pages/Detalle'; // Import Detalle page
import Panel from './pages/Panel'; // Import Panel page
import Gestion from './pages/Gestion'; // Import Gestion page
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import Asesores from './pages/Asesores';
import CrearInmueble from './pages/CrearInmueble';
import CRUD from './pages/CRUD';

export function App(){
    return (
        <Router>
            <AuthProvider>
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} /> {/* Home route */}
                        <Route path="/about" element={<About />} /> {/* About route */}
                        <Route path="/login" element={<Login />} /> {/* Login route */}
                        <Route path="/perfil" element={<Perfil />} /> {/* Perfil route without id */}
                        <Route path="/perfil/:id" element={<Perfil />} /> {/* Perfil route with id */}
                        <Route path="/buscar" element={<Buscar />} /> {/* Buscar route */}
                        <Route path="/detalle" element={<Detalle />} /> {/* Detalle route */}
                        <Route path="/panel" element={<Panel />} /> {/* Panel route */}
                        <Route path="/gestion" element={<Gestion />} /> {/* Gestion route */}
                        <Route path="/dashboard" element={<Dashboard />} /> {/* Gestion route */}
                        <Route path="/register" element={<Register />} /> {/* Register route */}
                        <Route path="/asesores" element={<Asesores />} /> {/* Asesores route */}
                        <Route path="/nuevo" element={<CrearInmueble />} /> {/* Crear Inmueble route */}
                        <Route path="/crud" element={<CRUD />} /> {/* CRUD route */}
                    </Routes>
                </div>
            </AuthProvider>
        </Router>
    )
}
