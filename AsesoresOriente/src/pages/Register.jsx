import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Menu } from '../components/Menu';
import '../styles/Register.css';
import '../styles/layout.css';

import '../styles/layout.css';
import PageTitle from '../components/PageTitle';
import { verifyPermissions } from '../utils/permissionUtils';
import ToastMessage from '../components/ToastMessage';

const Register = () => {
  // Estado para los datos del formulario
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
  // Estado para la lista de usuarios registrados
  const [usuarios, setUsuarios] = useState([]);
  // Estado para el usuario seleccionado (edición)
  const [selectedUsuarioId, setSelectedUsuarioId] = useState(null);
  const [selectedAsesorId, setSelectedAsesorId] = useState(null);
  // Estados para mensajes de error y éxito
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Estado para mostrar mensajes toast
  const [toast, setToast] = useState({ message: '', type: 'info' });

  const { user } = useAuth();
  const navigate = useNavigate();

  // Verificar permisos al cargar la página
  useEffect(() => {
    const allowed = verifyPermissions(user, ['ADMINISTRADOR', 'GERENTE']);
    if (!allowed) {
      setToast({ message: 'No tiene permisos para acceder a esta sección', type: 'error' });
      navigate('/');
    }
  }, [user, navigate]);

  // Cargar usuarios y limpiar formulario al iniciar
  useEffect(() => {
    fetchUsuarios();
    clearForm();
  }, []);

  // Función para obtener usuarios desde la API
  const fetchUsuarios = async () => {
    try {
      const response = await fetch('/api/usuario');
      if (!response.ok) {
        throw new Error('Error al obtener usuarios');
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (err) {
      setError(err.message);
      setToast({ message: err.message, type: 'error' });
    }
  };

  // Manejar cambios en los inputs del formulario
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Cargar datos de un usuario para edición
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
      Contraseña: '', // No cargar contraseña por seguridad
      Rol: roleMapDbToSelect[usuario.rol] || roleMapDbToSelect[usuario.Rol] || roleMapDbToSelect[usuario.rol_id] || '',
    });
    setSuccess('');
    setError('');
  };

  // Limpiar formulario y estados
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

  // Manejar envío del formulario para crear o actualizar usuario y asesor
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
        // Actualizar asesor primero
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
            // Removed Pfp field from update
          }),
        });

        if (!asesorResponse.ok) {
          const data = await asesorResponse.json();
          setError(data.error || 'Error al actualizar asesor');
          setToast({ message: data.error || 'Error al actualizar asesor', type: 'error' });
          return;
        }

        // Actualizar usuario
        const updateBody = {
          nombre_usuario: formData.NombreUsuario,
          correo: formData.Correo,
          contrasena: formData.Contraseña,
          ...(formData.Rol ? { Rol: roleMapSelectToDb[formData.Rol] || formData.Rol } : {}),
          id_asesor: selectedAsesorId,
        };
        console.log('Update usuario request body:', updateBody);
        const usuarioResponse = await fetch(`/api/usuario/${selectedUsuarioId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateBody),
        });

        if (!usuarioResponse.ok) {
          const data = await usuarioResponse.json();
          setError(data.error || 'Error al actualizar usuario');
          setToast({ message: data.error || 'Error al actualizar usuario', type: 'error' });
          return;
        }

        setSuccess('Usuario y asesor actualizados correctamente');
        setToast({ message: 'Usuario y asesor actualizados correctamente', type: 'success' });
        // Recargar usuarios y recargar formulario con datos actualizados
        await fetchUsuarios();
        // Recargar datos del usuario actualizado en el formulario
        const updatedUsuario = usuarios.find(u => u.usuario_id === selectedUsuarioId);
        if (updatedUsuario) {
          loadUsuario(updatedUsuario);
        }
      } else {
        // Crear asesor primero
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
            // Removed Pfp field from create
          }),
        });

        if (!asesorResponse.ok) {
          const data = await asesorResponse.json();
          setError(data.error || 'Error al registrar asesor');
          setToast({ message: data.error || 'Error al registrar asesor', type: 'error' });
          return;
        }

        const asesorData = await asesorResponse.json();

        // Crear usuario con id de asesor
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
          setError(data.error || 'Error al registrar usuario');
          setToast({ message: data.error || 'Error al registrar usuario', type: 'error' });
          return;
        }

        setSuccess('Usuario y asesor registrados correctamente');
        setToast({ message: 'Usuario y asesor registrados correctamente', type: 'success' });
      }

      clearForm();
      fetchUsuarios();
    } catch (err) {
      setError('Error al registrar o actualizar usuario');
      setToast({ message: 'Error al registrar o actualizar usuario', type: 'error' });
    }
  };

  return (
    <>
      {/* Mostrar mensaje toast si existe */}
      {toast.message && <ToastMessage message={toast.message} type={toast.type} />}
      <Menu />
      <div className="register menu-offset">
        <PageTitle>{selectedUsuarioId ? 'Actualizar Usuario y Asesor' : 'Registrar Usuario y Asesor'}</PageTitle>
        <div className="register-content page-container">
          <div className="form-container">
            <div className="form-header">
              {selectedUsuarioId && (
                <button className="clear-button" onClick={clearForm} title="Agregar Nuevo Usuario">
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

              <label htmlFor="Cedula">Cédula:</label>
              <input
                type="text"
                id="Cedula"
                name="Cedula"
                value={formData.Cedula}
                onChange={handleChange}
                autoComplete="off"
              />

              <label htmlFor="Telefono">Teléfono:</label>
              <input
                type="text"
                id="Telefono"
                name="Telefono"
                value={formData.Telefono}
                onChange={handleChange}
                autoComplete="off"
              />

              {/* Removed Pfp field as user can change profile picture from their profile page */}

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
                required={!selectedUsuarioId} // Contraseña requerida solo al crear
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
                <option value="">Seleccione un rol</option>
                <option value="Asesor">Asesor</option>
                <option value="Gerente">Gerente</option>
                <option value="Administrador">Administrador</option>
              </select>

              <button type="submit">{selectedUsuarioId ? 'Actualizar' : 'Registrar'}</button>
            </form>
            {success && <p className="success-message">{success}</p>}
            {error && <p className="error-message">{error}</p>}
          </div>
          <div className="list-container">
            <h3>Usuarios Registrados</h3>
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
      </div>
    </>
  );
};

export default Register;
