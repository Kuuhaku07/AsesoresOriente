import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ToastContainer from '../components/ToastContainer.jsx';
import { validateData } from '../utils/validationUtils.js';
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
  const toastRef = useRef(null);

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
      validationErrors.forEach(error => {
        if (toastRef.current) {
          toastRef.current.addToast(error, 'error');
        }
      });
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
        if (toastRef.current) {
          toastRef.current.addToast(errorMsg, 'error');
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
      if (toastRef.current) {
        toastRef.current.addToast('Error de red. Intenta nuevamente.', 'error');
      }
      setServerError('Error de red. Intenta nuevamente.');
      setIsLoading(false);
    }
  };

  return (
    <>
      <ToastContainer ref={toastRef} />
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-5">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-10 text-center md:max-w-sm md:p-8">
          <div className="mb-8">
            <img src={Logo} alt="Logo" className="h-24 mb-5 mx-auto" />
            <h2 className="m-0 mb-2 text-gray-800 text-2xl md:text-xl">Iniciar Sesión</h2>
            <p className="m-0 text-gray-600 text-sm">Acceso exclusivo para los Agentes Asociados</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            <div className="text-left">
              <label htmlFor="identificador" className="block mb-2 text-sm text-gray-700 font-medium">Usuario o Correo Electrónico</label>
              <input
                type="text"
                id="identificador"
                name="identificador"
                value={credentials.identificador}
                onChange={handleChange}
                required
                placeholder="usuario o correo"
                className="w-full p-3 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <div className="text-left">
              <label htmlFor="Contraseña" className="block mb-2 text-sm text-gray-700 font-medium">Contraseña</label>
              <input
                type="password"
                id="Contraseña"
                name="Contraseña"
                value={credentials.Contraseña}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full p-3 border border-gray-300 rounded-lg text-base transition-colors focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              />
            </div>

            <button
              type="submit"
              className="bg-blue-500 text-white border-none rounded-lg p-3.5 text-base font-semibold cursor-pointer transition-colors mt-2.5 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isLoading}
            >
              {isLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
          </form>

          <div className="mt-8 text-xs text-gray-500">
            <p className="m-0">¿Problemas para acceder? Contacta al administrador</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
