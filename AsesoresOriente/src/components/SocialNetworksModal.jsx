import React, { useState, useEffect } from 'react';
import ToastMessage from './ToastMessage.jsx';
import '../styles/Perfil.css';

const SocialNetworksModal = ({ isOpen, onClose, redes, token, onUpdate }) => {
  const [socialNetworks, setSocialNetworks] = useState([]);
  const [editingNetwork, setEditingNetwork] = useState(null);
  const [formData, setFormData] = useState({ red_social_id: '', url: '' });
  const [errors, setErrors] = useState([]);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (redes) {
      setSocialNetworks(redes);
    }
  }, [redes]);

  useEffect(() => {
    if (isOpen) {
      setErrors([]);
      setServerError('');
      setSuccessMessage('');
      resetForm();
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value });
  };

  const openEdit = (network) => {
    setEditingNetwork(network);
    setFormData({ red_social_id: network.red_social_id, url: network.url });
    setErrors([]);
    setServerError('');
    setSuccessMessage('');
  };

  const resetForm = () => {
    setEditingNetwork(null);
    setFormData({ red_social_id: '', url: '' });
    setErrors([]);
    setServerError('');
    setSuccessMessage('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Está seguro de eliminar esta red social?')) return;
    try {
      const response = await fetch('/api/redesasesor/' + id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!response.ok) {
        const data = await response.json();
        setServerError(data.error || 'Error al eliminar la red social');
        return;
      }
      setSocialNetworks(socialNetworks.filter((sn) => sn.id !== id));
      onUpdate();
      setSuccessMessage('Red social eliminada correctamente');
    } catch (error) {
      setServerError('Error al eliminar la red social');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    setServerError('');
    setSuccessMessage('');

    if (!formData.red_social_id) {
      setErrors(['Debe seleccionar una red social']);
      return;
    }
    if (!formData.url) {
      setErrors(['Debe ingresar la URL o identificador']);
      return;
    }

    try {
      const method = editingNetwork ? 'PUT' : 'POST';
      const url = editingNetwork ? '/api/redesasesor/' + editingNetwork.id : '/api/redesasesor';
      const body = JSON.stringify({
        red_social_id: formData.red_social_id,
        url: formData.url
      });
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token
        },
        body
      });
      if (!response.ok) {
        const data = await response.json();
        setServerError(data.error || 'Error al guardar la red social');
        return;
      }
      const savedNetwork = await response.json();
      let updatedNetworks;
      if (editingNetwork) {
        updatedNetworks = socialNetworks.map((sn) => (sn.id === savedNetwork.id ? savedNetwork : sn));
      } else {
        updatedNetworks = [...socialNetworks, savedNetwork];
      }
      setSocialNetworks(updatedNetworks);
      onUpdate();
      setSuccessMessage('Red social guardada correctamente');
      resetForm();
    } catch (error) {
      setServerError('Error al guardar la red social');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Gestionar Redes Sociales</h2>
        {errors.length > 0 && errors.map((err, i) => <ToastMessage key={i} message={err} type="error" />)}
        {serverError && <ToastMessage message={serverError} type="error" />}
        {successMessage && <ToastMessage message={successMessage} type="success" />}
        <ul>
          {socialNetworks.length === 0 && <li>No hay redes sociales asociadas.</li>}
          {socialNetworks.map((sn) => (
            <li key={sn.id} style={{ marginBottom: '10px' }}>
              <strong>{sn.nombre}</strong>: {sn.url}
              <button style={{ marginLeft: '10px' }} onClick={() => openEdit(sn)}>Editar</button>
              <button style={{ marginLeft: '5px' }} onClick={() => handleDelete(sn.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
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
            URL o Identificador:
            <input type="text" name="url" value={formData.url} onChange={handleInputChange} />
          </label>
          <div className="modal-buttons">
            <button type="submit">{editingNetwork ? 'Actualizar' : 'Agregar'}</button>
            <button type="button" onClick={() => { resetForm(); onClose(); }}>Cerrar</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SocialNetworksModal;
