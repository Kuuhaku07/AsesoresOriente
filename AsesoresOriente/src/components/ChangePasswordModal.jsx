import React, { useState, useEffect, useRef } from 'react';
import ToastContainer from './ToastContainer.jsx';
import '../styles/Perfil.css';

const ChangePasswordModal = ({ isOpen, onClose, user, token }) => {
  const [isLoading, setIsLoading] = useState(false);
  const toastRef = useRef(null);

  useEffect(() => {
    if (isOpen && toastRef.current && typeof toastRef.current.clearToasts === 'function') {
      toastRef.current.clearToasts();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (toastRef.current && typeof toastRef.current.clearToasts === 'function') {
      toastRef.current.clearToasts();
    }
    setIsLoading(true);

    const currentPassword = e.target.currentPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;

    if (newPassword !== confirmPassword) {
      if (toastRef.current) {
        toastRef.current.addToast('La nueva contraseña y la confirmación no coinciden.', 'error');
      }
      setIsLoading(false);
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
        if (toastRef.current) {
          toastRef.current.addToast(data.error || 'Error al cambiar la contraseña', 'error');
        }
        setIsLoading(false);
        return;
      }
      if (toastRef.current) {
        toastRef.current.addToast('Contraseña cambiada correctamente', 'success');
      }
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      if (toastRef.current) {
        toastRef.current.addToast('Error al cambiar la contraseña', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Cambiar Contraseña</h2>
        <ToastContainer ref={toastRef} />
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
            <button type="submit" disabled={isLoading}>Guardar</button>
            <button type="button" onClick={onClose} disabled={isLoading}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;
