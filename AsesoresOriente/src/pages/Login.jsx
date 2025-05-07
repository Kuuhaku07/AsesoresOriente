import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ToastMessage from '../components/ToastMessage.jsx';
import { validateData } from '../utils/validationUtils.js';
import '../styles/Login.css';
import Logo from '../assets/Logo.png';

const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    identificador: '',
    Contraseña: ''
  });
  const [errors, setErrors] = useState([]);
  const [serverError, setServerError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const rules = {
    identificador: { required: true },
    Contraseña: { required: true, min: 6 },
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
    setErrors([]);
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar datos localmente
    const validationErrors = validateData(credentials, rules);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);
    setErrors([]);
    setServerError('');

    try {
      const response = await fetch('/api/usuario/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          identifier: credentials.identificador,
          Contraseña: credentials.Contraseña
        })
      });

      if (!response.ok) {
        const data = await response.json();
        let errorMsg = data.error || 'Error en la autenticación';
        if (errorMsg === 'Invalid username/email or password') {
          errorMsg = 'Usuario o contraseña inválidos';
        }
        setServerError(errorMsg);
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
      // Optionally navigate after login
      // navigate('/dashboard');
    } catch (err) {
      setServerError('Error de red. Intenta nuevamente.');
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

        {/* Mostrar errores de validación */}
        {errors.length > 0 &&
          errors.map((error, index) => (
            <ToastMessage key={index} message={error} type="error" />
          ))}

        {/* Mostrar error del servidor */}
        {serverError && <ToastMessage message={serverError} type="error" />}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="identificador">Usuario o Correo Electrónico</label>
            <input
              type="text"
              id="identificador"
              name="identificador"
              value={credentials.identificador}
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
