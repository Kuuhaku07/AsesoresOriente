import React, { useState, useEffect } from 'react';
import ToastMessage from './ToastMessage.jsx';
import '../styles/Perfil.css';

const ChangePasswordModal = ({ isOpen, onClose, user, token }) => {
  const [errors, setErrors] = useState([]);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setErrors([]);
      setServerError('');
      setSuccessMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setServerError('');
    setSuccessMessage('');

    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      setErrors(['La nueva contraseña y la confirmación no coinciden.']);
      return;
    }

    try {
      const response = await fetch(`/api/usuario/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword,
          newPassword
        })
      });
      if (!response.ok) {
        const data = await response.json();
        setServerError(data.error || 'Error al cambiar la contraseña');
        return;
      }
      setSuccessMessage('Contraseña cambiada correctamente');
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setServerError('Error al cambiar la contraseña');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Cambiar Contraseña</h2>
        {errors.length > 0 && errors.map((error, index) => (
          <ToastMessage key={index} message={error} type="error" />
        ))}
        {serverError && <ToastMessage message={serverError} type="error" />}
        {successMessage && <ToastMessage message={successMessage} type="success" />}
        <form onSubmit={handleSubmit}>
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
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
