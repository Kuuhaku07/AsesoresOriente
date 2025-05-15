import React, { useState, useEffect, useRef } from 'react';
import ToastContainer from './ToastContainer.jsx';
import '../styles/Perfil.css';

const AddSocialNetworkModal = ({ isOpen, onClose, redes, token, onUpdate }) => {
  const [formData, setFormData] = useState({ red_social_id: '', url: '', identifier: '' });
  const toastRef = useRef(null);

  useEffect(() => {
    if (isOpen && toastRef.current && typeof toastRef.current.clearToasts === 'function') {
      toastRef.current.clearToasts();
    }
    if (isOpen) {
      setFormData({ red_social_id: '', url: '', identifier: '' });
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const errs = [];
    if (!formData.red_social_id) {
      errs.push('Debe seleccionar una red social');
    }
    if (!formData.url && !formData.identifier) {
      errs.push('Debe ingresar la URL o identificador');
    }
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (toastRef.current && typeof toastRef.current.clearToasts === 'function') {
      toastRef.current.clearToasts();
    }

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      validationErrors.forEach(error => {
        if (toastRef.current) {
          toastRef.current.addToast(error, 'error');
        }
      });
      return;
    }

    try {
      const response = await fetch('/api/redesasesor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body: JSON.stringify({
          red_social_id: formData.red_social_id,
          url: formData.url,
          identifier: formData.identifier
        })
      });
      if (!response.ok) {
        const data = await response.json();
        if (toastRef.current) {
          toastRef.current.addToast(data.error || 'Error al agregar la red social', 'error');
        }
        return;
      }
      if (toastRef.current) {
        toastRef.current.addToast('Red social agregada correctamente', 'success');
      }
      onUpdate();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      if (toastRef.current) {
        toastRef.current.addToast('Error al agregar la red social', 'error');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Añadir Red Social</h2>
        <ToastContainer ref={toastRef} />
        <form onSubmit={handleSubmit}>
          <label>
            Red Social:
            <select name="red_social_id" value={formData.red_social_id} onChange={handleInputChange}>
              <option value="">Seleccione una red social</option>
              {redes && redes.length > 0 && redes.map((red) => (
                <option key={red.id} value={red.id}>{red.nombre}</option>
              ))}
            </select>
          </label>
          <label>
            URL:
            <input type="text" name="url" value={formData.url} onChange={handleInputChange} />
          </label>
          <label>
            Identificador:
            <input type="text" name="identifier" value={formData.identifier} onChange={handleInputChange} />
          </label>
          <div className="modal-buttons">
            <button type="submit">Agregar</button>
            <button type="button" onClick={onClose}>Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSocialNetworkModal;
