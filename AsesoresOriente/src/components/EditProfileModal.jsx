import React, { useState, useEffect, useRef } from 'react';
import ToastContainer from './ToastContainer.jsx';
import ChangePasswordModal from './ChangePasswordModal.jsx';
import '../styles/Perfil.css';

const EditProfileModal = ({ isOpen, onClose, user, token, onUpdate }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showCurrentPasswordInput, setShowCurrentPasswordInput] = useState(false);
  const [originalSensitiveValues] = useState({
    NombreUsuario: user.NombreUsuario || '',
    Correo: user.Correo || '',
    Cedula: user.Cedula || ''
  });
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);
  const toastRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      if (toastRef.current && typeof toastRef.current.clearToasts === 'function') {
        toastRef.current.clearToasts();
      }
      setSelectedFile(null);
      setShowCurrentPasswordInput(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    if (
      newValue !== originalSensitiveValues.NombreUsuario ||
      document.getElementsByName('correo')[0].value !== originalSensitiveValues.Correo ||
      document.getElementsByName('cedula')[0].value !== originalSensitiveValues.Cedula
    ) {
      setShowCurrentPasswordInput(true);
    } else {
      setShowCurrentPasswordInput(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (toastRef.current && typeof toastRef.current.clearToasts === 'function') {
      toastRef.current.clearToasts();
    }

    const form = e.target;
    const formData = new FormData(form);

    if (selectedFile) {
      formData.append('pfp', selectedFile);
    }

    if (user.id_asesor && Number.isInteger(user.id_asesor)) {
      formData.append('id_asesor', user.id_asesor);
    }

    const roleMap = {
      'Asesor': 1,
      'Gerente': 2,
      'Administrador': 3
    };
    formData.append('Rol', roleMap[user.role] || user.role);

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

    const direccionInput = formData.get('direccion');
    if (direccionInput !== null) {
      formData.delete('direccion');
      formData.append('Direccion', direccionInput);
    }

    const especialidadInput = formData.get('especialidad');
    if (especialidadInput !== null) {
      formData.delete('especialidad');
      formData.append('Especialidad', especialidadInput);
    }

    const fechaNacimientoInput = formData.get('fecha_nacimiento');
    if (fechaNacimientoInput !== null) {
      formData.delete('fecha_nacimiento');
      formData.append('FechaNacimiento', fechaNacimientoInput);
    }

    try {
      const response = await fetch('/api/usuario/' + user.id, {
        method: 'PUT',
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.errors) {
          errorData.errors.forEach(error => {
            if (toastRef.current) {
              toastRef.current.addToast(error, 'error');
            }
          });
        } else if (errorData.error) {
          if (toastRef.current) {
            toastRef.current.addToast(errorData.error, 'error');
          }
        } else {
          if (toastRef.current) {
            toastRef.current.addToast('Error al actualizar el perfil', 'error');
          }
        }
        return;
      }
      await onUpdate();
      if (toastRef.current) {
        toastRef.current.addToast('Perfil actualizado correctamente', 'success');
      }
      // Modal stays open; user closes manually
    } catch (error) {
      if (toastRef.current) {
        toastRef.current.addToast('Error al actualizar el perfil', 'error');
      }
    }
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>Editar Perfil</h2>
          <ToastContainer ref={toastRef} />
          <form onSubmit={handleSubmit}>
            <label>
              Nombre de Usuario:
              <input
                type="text"
                defaultValue={user.NombreUsuario}
                name="name"
                onChange={handleInputChange}
              />
            </label>
            <label>
              Teléfono:
              <input type="text" defaultValue={user.Telefono} name="telefono" />
            </label>
            <label>
              Correo Electrónico:
              <input
                type="email"
                defaultValue={user.Correo}
                name="correo"
                onChange={handleInputChange}
              />
            </label>
            <label>
              Cédula:
              <input
                type="text"
                defaultValue={user.Cedula}
                name="cedula"
                onChange={handleInputChange}
              />
            </label>
            <label>
              Fecha de Nacimiento:
              <input
                type="date"
                defaultValue={user.FechaNacimiento ? user.FechaNacimiento.split('T')[0] : ''}
                name="fecha_nacimiento"
              />
            </label>
            <label>
              Especialidad:
              <input type="text" defaultValue={user.Especialidad} name="especialidad" />
            </label>
            <label>
              Dirección:
              <input type="text" defaultValue={user.Direccion} name="direccion" />
            </label>
            <label>
              Estado:
              <select name="activo" defaultValue={user.Activo ? 'true' : 'false'}>
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </label>
            {showCurrentPasswordInput && (
              <label>
                Contraseña Actual (para confirmar cambios sensibles):
                <input type="password" name="currentPassword" />
              </label>
            )}
            <label>
              Foto de Perfil:
              <input type="file" accept="image/*" onChange={handleFileChange} />
            </label>
            <div className="modal-buttons">
              <button type="submit">Guardar</button>
              <button type="button" onClick={onClose}>Cancelar</button>
              <button type="button" onClick={() => setIsChangePasswordOpen(true)}>Cambiar Contraseña</button>
            </div>
          </form>
        </div>
      </div>
      <ChangePasswordModal
        isOpen={isChangePasswordOpen}
        onClose={() => setIsChangePasswordOpen(false)}
        user={user}
        token={token}
      />
    </>
  );
};
export default EditProfileModal;

