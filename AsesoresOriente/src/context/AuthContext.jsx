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
      const response = await authFetch('http://localhost:5000/api/usuario/me', {
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
      console.log('AuthContext: setting user:', normalizedUser);
      setUser(normalizedUser);
      localStorage.setItem('user', JSON.stringify(normalizedUser));
    } catch (error) {
      console.error('Error fetching user data:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  // Refresh access token using refresh token
  const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      logout();
      return null;
    }
    try {
      const response = await fetch('http://localhost:5000/api/usuario/refresh-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken }),
      });
      if (!response.ok) {
        logout();
        return null;
      }
      const data = await response.json();
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return data.token;
    } catch (error) {
      console.error('Error refreshing access token:', error);
      logout();
      return null;
    }
  };

  // Wrapper for fetch to handle token refresh on 401
  const authFetch = async (url, options = {}) => {
    const authOptions = {
      ...options,
      headers: {
        ...(options.headers || {}),
      },
    };
    if (token) {
      authOptions.headers.Authorization = `Bearer ${token}`;
    }
    let response = await fetch(url, authOptions);
    if (response.status === 401) {
      const newToken = await refreshAccessToken();
      if (newToken) {
        authOptions.headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, authOptions);
      }
    }
    return response;
  };

  const login = (tokenParam, refreshTokenParam) => {
    setToken(tokenParam);
    localStorage.setItem('token', tokenParam);
    localStorage.setItem('refreshToken', refreshTokenParam);
    fetchUserData(tokenParam);
    navigate('/dashboard');
  };

  const logout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await fetch('http://localhost:5000/api/usuario/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        console.error('Error during logout request:', error);
      }
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    navigate('/login');
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    const storedUser = localStorage.getItem('user');
    if (storedToken && storedRefreshToken) {
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
    <AuthContext.Provider value={{ user, setUser, token, login, logout, loading, fetchUserData, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  return useContext(AuthContext);
}
