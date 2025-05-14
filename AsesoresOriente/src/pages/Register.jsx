import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu } from '../components/Menu';
import '../styles/Register.css';
import { verifyPermissions } from '../utils/permissionUtils';
import ToastMessage from '../components/ToastMessage';


const Register = () => {
  

  
  const [formData, setFormData] = useState({
    Nombre: '',
    Apellido: '',
    Cedula: '',
    Telefono: '',
    Pfp: '',
    Correo: '',
    NombreUsuario: '',
    Contraseña: '',
    Rol: '',
  });
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuarioId, setSelectedUsuarioId] = useState(null);
  const [selectedAsesorId, setSelectedAsesorId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
   // Function to show toast messages
  const [toast, setToast] = useState({ message: '', type: 'info' });

  useEffect(() => {
    const allowed = verifyPermissions(user, ['ADMINISTRADOR', 'GERENTE']);
    if (!allowed) {
      setToast({ message: 'No tiene permisos para acceder a esta sección', type: 'error' });
      navigate('/');
    }
  }, [user, navigate]);
  useEffect(() => {
    fetchUsuarios();
    clearForm(); // Clear form on initial load to avoid pre-filled data
    
  }, []);

  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/api/usuario');
      if (!response.ok) {
        throw new Error('Failed to fetch usuarios');
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const loadUsuario = (usuario) => {
    const roleMapDbToSelect = {
      'ADMINISTRADOR': 'Administrador',
      'GERENTE': 'Gerente',
      'ASESOR': 'Asesor',
      'Administrador': 'Administrador',
      'Gerente': 'Gerente',
      'Asesor': 'Asesor'
    };
    setSelectedUsuarioId(usuario.usuario_id);
    setSelectedAsesorId(usuario.asesor_id);
    setFormData({
      Nombre: usuario.Nombre || '',
      Apellido: usuario.Apellido || '',
      Cedula: usuario.Cedula || '',
      Telefono: usuario.Telefono || '',
      Pfp: usuario.Pfp || '',
      Correo: usuario.Correo || '',
      NombreUsuario: usuario.NombreUsuario || '',
      Contraseña: '', // Do not load password for security reasons
      Rol: roleMapDbToSelect[usuario.rol] || roleMapDbToSelect[usuario.Rol] || roleMapDbToSelect[usuario.rol_id] || '',
    });
    setSuccess('');
    setError('');
  };

  const clearForm = () => {
    setSelectedUsuarioId(null);
    setSelectedAsesorId(null);
    setFormData({
      Nombre: '',
      Apellido: '',
      Cedula: '',
      Telefono: '',
      Pfp: '',
      Correo: '',
      NombreUsuario: '',
      Contraseña: '',
      Rol: '',
    });
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    const roleMapSelectToDb = {
      'Administrador': 'ADMINISTRADOR',
      'Gerente': 'GERENTE',
      'Asesor': 'ASESOR'
    };
    try {
      if (selectedUsuarioId && selectedAsesorId) {
        // Update flow
        // Update asesor first
        const asesorResponse = await fetch(`/api/asesor/${selectedAsesorId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Nombre: formData.Nombre,
            Apellido: formData.Apellido,
            Cedula: formData.Cedula || null,
            Telefono: formData.Telefono || null,
            Correo: formData.Correo || null,
            Pfp: formData.Pfp || null,
          }),
        });

        if (!asesorResponse.ok) {
          const data = await asesorResponse.json();
          setError(data.error || 'Failed to update asesor');
          return;
        }

        // Update usuario
        const usuarioResponse = await fetch(`/api/usuario/${selectedUsuarioId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            NombreUsuario: formData.NombreUsuario,
            Correo: formData.Correo,
            Contraseña: formData.Contraseña,
            Rol: roleMapSelectToDb[formData.Rol] || formData.Rol,
            id_asesor: selectedAsesorId,
          }),
        });

        if (!usuarioResponse.ok) {
          const data = await usuarioResponse.json();
          setError(data.error || 'Failed to update usuario');
          return;
        }

        setSuccess('User and asesor updated successfully!');
      } else {
        // Create flow
        // Create asesor first
        const asesorResponse = await fetch('/api/asesor', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            Nombre: formData.Nombre,
            Apellido: formData.Apellido,
            Cedula: formData.Cedula || null,
            Telefono: formData.Telefono || null,
            Correo: formData.Correo || null,
            Pfp: formData.Pfp || null,
          }),
        });

        if (!asesorResponse.ok) {
          const data = await asesorResponse.json();
          setError(data.error || 'Failed to register asesor');
          return;
        }

        const asesorData = await asesorResponse.json();

        // Create usuario with asesor id
        const usuarioResponse = await fetch('/api/usuario', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            NombreUsuario: formData.NombreUsuario,
            Correo: formData.Correo,
            Contraseña: formData.Contraseña,
            Rol: roleMapSelectToDb[formData.Rol] || formData.Rol,
            id_asesor: asesorData.id,
          }),
        });

        if (!usuarioResponse.ok) {
          const data = await usuarioResponse.json();
          setError(data.error || 'Failed to register usuario');
          return;
        }

        setSuccess('User and asesor registered successfully!');
      }

      clearForm();
      fetchUsuarios();
    } catch (err) {
      setError('Failed to register or update user');
    }
  };

  return (
    <>
      {toast.message && <ToastMessage message={toast.message} type={toast.type} />}
      <Menu />
      <div className="register-page">
        <div className="form-container">
          <div className="form-header">
            <h2>{selectedUsuarioId ? 'Update User and Asesor' : 'Register User and Asesor'}</h2>
            {selectedUsuarioId && (
              <button className="clear-button" onClick={clearForm} title="Add New User">
                +
              </button>
            )}
          </div>
          <form onSubmit={handleSubmit} className="register-form" autoComplete="off">
            <label htmlFor="Nombre">Nombre:</label>
            <input
              type="text"
              id="Nombre"
              name="Nombre"
              value={formData.Nombre}
              onChange={handleChange}
              required
              autoComplete="off"
            />

            <label htmlFor="Apellido">Apellido:</label>
            <input
              type="text"
              id="Apellido"
              name="Apellido"
              value={formData.Apellido}
              onChange={handleChange}
              required
              autoComplete="off"
            />

            <label htmlFor="Cedula">Cedula:</label>
            <input
              type="text"
              id="Cedula"
              name="Cedula"
              value={formData.Cedula}
              onChange={handleChange}
              autoComplete="off"
            />

            <label htmlFor="Telefono">Telefono:</label>
            <input
              type="text"
              id="Telefono"
              name="Telefono"
              value={formData.Telefono}
              onChange={handleChange}
              autoComplete="off"
            />

            <label htmlFor="Pfp">Pfp (profile picture URL):</label>
            <input
              type="text"
              id="Pfp"
              name="Pfp"
              value={formData.Pfp}
              onChange={handleChange}
              autoComplete="off"
            />

            <label htmlFor="NombreUsuario">Nombre de Usuario:</label>
            <input
              type="text"
              id="NombreUsuario"
              name="NombreUsuario"
              value={formData.NombreUsuario}
              onChange={handleChange}
              required
              autoComplete="off"
            />
            <label htmlFor="Correo">Correo:</label>
            <input
              type="email"
              id="Correo"
              name="Correo"
              value={formData.Correo}
              onChange={handleChange}
              required
              autoComplete="off"
            />

            <label htmlFor="Contraseña">Contraseña:</label>
            <input
              type="password"
              id="Contraseña"
              name="Contraseña"
              value={formData.Contraseña}
              onChange={handleChange}
              required={!selectedUsuarioId} // Password required only on create
              autoComplete="new-password"
            />

            <label htmlFor="Rol">Rol:</label>
            <select
              id="Rol"
              name="Rol"
              value={formData.Rol}
              onChange={handleChange}
              required
              className="select-input"
            >
              <option value="">Select role</option>
              <option value="Asesor">Asesor</option>
              <option value="Gerente">Gerente</option>
              <option value="Administrador">Administrador</option>
            </select>

            <button type="submit">{selectedUsuarioId ? 'Update' : 'Register'}</button>
          </form>
          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}
        </div>
        <div className="list-container">
          <h3>Registered Users</h3>
          <ul className="user-list">
            {usuarios.map((usuario) => (
              <li
                key={usuario.usuario_id}
                onClick={() => loadUsuario(usuario)}
                className={usuario.usuario_id === selectedUsuarioId ? 'selected' : ''}
              >
                {usuario.Nombre} {usuario.Apellido} - {usuario.Correo}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default Register;
