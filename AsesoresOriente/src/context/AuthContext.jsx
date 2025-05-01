import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch fresh user data from backend using token
  const fetchUserData = async (tokenParam) => {
    const usedToken = tokenParam || token;
    if (!usedToken) {
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('http://localhost:5000/api/usuario/me', {
        headers: {
          Authorization: `Bearer ${usedToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      // Normalize user data keys to match frontend expectations
      const normalizedUser = {
        id: data.id,
        name: data.Nombre || data.name || '',
        username: data.NombreUsuario || data.nombre_usuario || '',
        email: data.Correo || data.email || '',
        role: data.Rol || data.role || '',
        pfp: data.Pfp || data.pfp || '',
        id_asesor: data.id_asesor || null,
      };
      setUser(normalizedUser);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (tokenParam, userData) => {
    setToken(tokenParam);
    localStorage.setItem('token', tokenParam);
    // Instead of setting user directly, fetch fresh user data
    fetchUserData(tokenParam);
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (storedToken) {
      setToken(storedToken);
      fetchUserData(storedToken);
    } else {
      setLoading(false);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, logout, loading, fetchUserData }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
