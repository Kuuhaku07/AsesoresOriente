import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Menu } from '../components/Menu';
import { Navigate } from 'react-router-dom';
import '../styles/Perfil.css';

const Perfil = () => {
  const { user, fetchUserData, token } = useAuth();

  // Estados para controlar la visibilidad de los modales
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  // Show loading or null while user is being initialized
  if (user === null) {
    return null; // or a loading spinner
  }

  // Redirigir a home si no hay usuario logueado
  if (!user) {
    return <Navigate to="/" />;
  }

  // Funciones para abrir y cerrar modales
  const openEditModal = () => setIsEditModalOpen(true);
  const closeEditModal = () => setIsEditModalOpen(false);

  const openChangePasswordModal = () => setIsChangePasswordModalOpen(true);
  const closeChangePasswordModal = () => setIsChangePasswordModalOpen(false);

  // Manejar cambio de archivo para la foto de perfil
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Manejar envío del formulario de edición de perfil (sin email)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
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

    // Rename 'name' field to 'NombreUsuario' expected by backend
    const nameInput = formData.get('name');
    formData.delete('name');
    formData.append('NombreUsuario', nameInput);

    try {
      const response = await fetch(`/api/usuario/${user.id}`, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Validation errors:', errorData.errors);
        throw new Error('Error al actualizar el perfil');
      }
      // After successful update, refresh user context from backend
      await fetchUserData(token);
      alert('Perfil actualizado correctamente');
      closeEditModal();
    } catch (error) {
      alert(error.message);
    }
  };

  // Manejar envío del formulario de cambio de contraseña
  const handleChangePasswordSubmit = (e) => {
    e.preventDefault();
    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      alert('La nueva contraseña y la confirmación no coinciden.');
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
        <h1>Perfil</h1>
        <div className="perfil-content">
          {/* Sección de información del usuario */}
          <section className="user-info">
            {user.pfp ? (
              <img src={`uploads/profile_pictures/${user.pfp}`} alt={user.name} className="user-avatar" /> 
            ) : null}
            <h2>{user.name}</h2>
            <p>Rol: {user.role}</p>
            <p>Email: {user.email}</p>
            <button className="edit-profile-btn" onClick={openEditModal}>
              Editar Perfil
            </button>
          </section>

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
                  {/* Email no editable, se muestra solo */}
                  <label>
                    Email:
                    <input type="email" value={user.email} disabled />
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
