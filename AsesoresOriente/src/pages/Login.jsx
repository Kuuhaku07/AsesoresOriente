import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Login.css';
import Logo from '../assets/Logo.png';

const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    identifier: '',
    Contraseña: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: credentials.identifier,
          Contraseña: credentials.Contraseña
        })
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error || 'Error en la autenticación');
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      const token = data.token;
      const refreshToken = data.refreshToken;

      // Decode token payload to get user info
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const userData = JSON.parse(jsonPayload);

      login(token, refreshToken);
    } catch (err) {
      setError('Error de red. Intenta nuevamente.');
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={Logo} alt="Logo" className="login-logo" />
          <h2>Iniciar Sesión</h2>
          <p>Acceso exclusivo para los Agentes Asociados</p>
        </div>

        {error && <div className="login-error">{error}</div>}

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="identifier">Usuario o Correo Electrónico</label>
            <input
              type="text"
              id="identifier"
              name="identifier"
              value={credentials.identifier}
              onChange={handleChange}
              required
              placeholder="usuario o correo"
            />
          </div>

          <div className="form-group">
            <label htmlFor="Contraseña">Contraseña</label>
            <input
              type="password"
              id="Contraseña"
              name="Contraseña"
              value={credentials.Contraseña}
              onChange={handleChange}
              required
              placeholder="••••••••"
            />
          </div>

          <button 
            type="submit" 
            className="login-button"
            disabled={isLoading}
          >
            {isLoading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div className="login-footer">
          <p>¿Problemas para acceder? Contacta al administrador</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
