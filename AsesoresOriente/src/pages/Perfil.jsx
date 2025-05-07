import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu } from '../components/Menu';
import ToastMessage from '../components/ToastMessage.jsx';
import { validateData } from '../utils/validationUtils.js';
import { Navigate } from 'react-router-dom';
import PageTitle from '../components/PageTitle';
import '../styles/Perfil.css';

const Perfil = () => {
  const { user, fetchUserData, token } = useAuth();

  // Estados para controlar la visibilidad de los modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Estados para validaciones y mensajes
  const [errors, setErrors] = useState([]);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Show loading or null while user is being initialized
  if (user === null) {
    return null; // or a loading spinner
  }

  // Redirigir a home si no hay usuario logueado
  if (!user) {
    return <Navigate to="/" />;
  }

  // Funciones para abrir y cerrar modales
  const openEditModal = () => {
    setErrors([]);
    setServerError('');
    setSuccessMessage('');
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const openChangePasswordModal = () => setIsChangePasswordModalOpen(true);
  const closeChangePasswordModal = () => setIsChangePasswordModalOpen(false);

  // Manejar cambio de archivo para la foto de perfil
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Reglas de validación para edición de perfil
  const validationRules = {
    name: { required: true, min: 3 },
    telefono: { required: true, min: 7 },
    correo: { required: true, email: true },
    currentPassword: { required: true, min: 6 }
  };

  // Manejar envío del formulario de edición de perfil (sin email)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setServerError('');
    setSuccessMessage('');

    const form = e.target;
    const formData = new FormData(form);

    // Validar datos localmente
    const formValues = {
      name: formData.get('name'),
      telefono: formData.get('telefono'),
      correo: formData.get('correo'),
      currentPassword: formData.get('currentPassword')
    };
    const validationErrors = validateData(formValues, validationRules);
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    if (selectedFile) {
      formData.append('pfp', selectedFile);
    }

    // Append asesor_id only if valid integer
    if (user.id_asesor && Number.isInteger(user.id_asesor)) {
      formData.append('id_asesor', user.id_asesor);
    }

    // Assuming role names map to rol_id as in backend
    const roleMap = {
      'Asesor': 1,
      'Gerente': 2,
      'Administrador': 3
    };
    formData.append('Rol', roleMap[user.role] || user.role);

    // Rename fields to expected backend names
    const nameInput = formData.get('name');
    formData.delete('name');
    formData.append('NombreUsuario', nameInput);

    const telefonoInput = formData.get('telefono');
    formData.delete('telefono');
    formData.append('Telefono', telefonoInput);

    const correoInput = formData.get('correo');
    formData.delete('correo');
    formData.append('Correo', correoInput);

    const currentPasswordInput = formData.get('currentPassword');
    formData.delete('currentPassword');
    formData.append('CurrentPassword', currentPasswordInput);

    try {
      const response = await fetch(`/api/usuario/${user.id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          setErrors(errorData.errors);
        } else if (errorData.error) {
          setServerError(errorData.error);
        } else {
          setServerError('Error al actualizar el perfil');
        }
        return;
      }
      // After successful update, refresh user context from backend
      await fetchUserData(token);
      setSuccessMessage('Perfil actualizado correctamente');
      closeEditModal();
    } catch (error) {
      setServerError('Error al actualizar el perfil');
    }
  };

  // Manejar envío del formulario de cambio de contraseña
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      setErrors(['La nueva contraseña y la confirmación no coinciden.']);
      return;
    }

    // Aquí se implementaría la lógica para cambiar la contraseña
    alert('Contraseña cambiada (funcionalidad no implementada)');
    closeChangePasswordModal();
  };

  return (
    <>
      <Menu />
      <div className="perfil">
        <PageTitle>Perfil</PageTitle>
        <div className="perfil-content">
          {/* Sección de información del usuario */}
          <section className="profile-header">
            {user.pfp ? (
              <img src={`uploads/profile_pictures/${user.pfp}`} alt={user.name} className="user-avatar" />
            ) : null}
            <div className="profile-header-info">
              <h2>{user.name} {user.lastname ? user.lastname : ''}</h2>
              <p className="profile-role">Rol: {user.role}</p>
            </div>
            <button className="edit-profile-btn" onClick={openEditModal}>
              Editar Perfil
            </button>
          </section>
          <section className="profile-sections">
            <div className="profile-card personal-info">
              <h3>Datos Personales</h3>
              <ul className="profile-info-list">
                <li><strong>Email:</strong> {user.email}</li>
                <li><strong>Teléfono:</strong> {user.telefono}</li>
                <li><strong>Cédula:</strong> {user.cedula}</li>
                <li><strong>Fecha de Nacimiento:</strong> {user.fecha_nacimiento ? new Date(user.fecha_nacimiento).toLocaleDateString() : 'No especificado'}</li>
                <li><strong>Especialidad:</strong> {user.especialidad ? user.especialidad : 'No especificado'}</li>
                <li><strong>Dirección:</strong> {user.direccion ? user.direccion : 'No especificado'}</li>
                <li><strong>Estado:</strong> {user.activo ? 'Activo' : 'Inactivo'}</li>
                <li><strong>Fecha de Ingreso:</strong> {user.fecha_ingreso ? new Date(user.fecha_ingreso).toLocaleDateString() : 'No especificado'}</li>
                <li><strong>Nombre de Usuario:</strong> {user.username}</li>
                <li><strong>Último Login:</strong> {user.ultimo_login ? new Date(user.ultimo_login).toLocaleString() : 'Nunca'}</li>
                <li><strong>Fecha de Creación:</strong> {user.fecha_creacion ? new Date(user.fecha_creacion).toLocaleDateString() : 'No especificado'}</li>
              </ul>
            </div>

            <div className="profile-card social-networks">
              <h3>Redes</h3>
              <p>Esta sección será implementada próximamente.</p>
            </div>

            <div className="profile-card properties-in-charge">
              <h3>Inmuebles a cargo</h3>
              <p>Esta sección será implementada próximamente.</p>
            </div>
          </section>

          {/* Mostrar errores de validación */}
          {errors.length > 0 &&
            errors.map((error, index) => (
              <ToastMessage key={index} message={error} type="error" />
            ))}

          {/* Mostrar error del servidor */}
          {serverError && <ToastMessage message={serverError} type="error" />}

          {/* Mostrar mensaje de éxito */}
          {successMessage && <ToastMessage message={successMessage} type="success" />}

          {/* Modal para editar perfil (sin email) */}
          {isEditModalOpen && (
            <div className="modal-overlay" onClick={closeEditModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Editar Perfil</h2>
                <form onSubmit={handleEditSubmit}>
                  <label>
                    Nombre de Usuario:
                    <input type="text" defaultValue={user.username} name="name" />
                  </label>
                  <label>
                    Teléfono:
                    <input type="text" defaultValue={user.telefono} name="telefono" />
                  </label>
                  <label>
                    Correo Electrónico:
                    <input type="email" defaultValue={user.email} name="correo" />
                  </label>
                  <label>
                    Cédula:
                    <input type="text" defaultValue={user.cedula} name="cedula" />
                  </label>
                  <label>
                    Fecha de Nacimiento:
                    <input type="date" defaultValue={user.fecha_nacimiento ? user.fecha_nacimiento.split('T')[0] : ''} name="fecha_nacimiento" />
                  </label>
                  <label>
                    Especialidad:
                    <input type="text" defaultValue={user.especialidad} name="especialidad" />
                  </label>
                  <label>
                    Dirección:
                    <input type="text" defaultValue={user.direccion} name="direccion" />
                  </label>
                  <label>
                    Estado:
                    <select name="activo" defaultValue={user.activo ? 'true' : 'false'}>
                      <option value="true">Activo</option>
                      <option value="false">Inactivo</option>
                    </select>
                  </label>
                  <label>
                    Contraseña Actual (para confirmar cambios sensibles):
                    <input type="password" name="currentPassword" />
                  </label>
                  <label>
                    Foto de Perfil:
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                  </label>
                  <button
                    type="button"
                    className="change-password-btn"
                    onClick={() => {
                      closeEditModal();
                      openChangePasswordModal();
                    }}
                  >
                    Cambiar Contraseña
                  </button>
                  <div className="modal-buttons">
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={closeEditModal}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Modal para cambiar contraseña */}
          {isChangePasswordModalOpen && (
            <div className="modal-overlay" onClick={closeChangePasswordModal}>
              <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2>Cambiar Contraseña</h2>
                <form onSubmit={handleChangePasswordSubmit}>
                  <label>
                    Contraseña Actual:
                    <input type="password" name="currentPassword" required />
                  </label>
                  <label>
                    Nueva Contraseña:
                    <input type="password" name="newPassword" required />
                  </label>
                  <label>
                    Confirmar Nueva Contraseña:
                    <input type="password" name="confirmPassword" required />
                  </label>
                  <div className="modal-buttons">
                    <button type="submit">Guardar</button>
                    <button type="button" onClick={closeChangePasswordModal}>
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Perfil;
