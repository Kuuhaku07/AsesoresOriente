import React, { useState, useEffect } from 'react';
import ToastMessage from './ToastMessage.jsx';
import '../styles/Perfil.css';

const AddSocialNetworkModal = ({ isOpen, onClose, redes, token, onUpdate }) => {
  const [formData, setFormData] = useState({ red_social_id: '', url: '', identifier: '' });
  const [errors, setErrors] = useState([]);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      setFormData({ red_social_id: '', url: '', identifier: '' });
      setErrors([]);
      setServerError('');
      setSuccessMessage('');
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
    setErrors([]);
    setServerError('');
    setSuccessMessage('');

    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setErrors(validationErrors);
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
        setServerError(data.error || 'Error al agregar la red social');
        return;
      }
      setSuccessMessage('Red social agregada correctamente');
      onUpdate();
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      setServerError('Error al agregar la red social');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Añadir Red Social</h2>
        {errors.length > 0 && errors.map((err, i) => <ToastMessage key={i} message={err} type="error" />)}
        {serverError && <ToastMessage message={serverError} type="error" />}
        {successMessage && <ToastMessage message={successMessage} type="success" />}
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
