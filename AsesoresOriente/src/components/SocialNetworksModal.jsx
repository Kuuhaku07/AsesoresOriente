import React, { useState, useEffect, useRef } from 'react';
import ToastContainer from './ToastContainer.jsx';
import HorizontalInfoCard from './HorizontalInfoCard.jsx';
import AddSocialNetworkModal from './AddSocialNetworkModal.jsx';
import '../styles/Perfil.css';

// Import react-icons for social network icons
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';

const iconMap = {
  'fa-facebook': FaFacebook,
  'fa-instagram': FaInstagram,
  'fa-twitter': FaTwitter,
};

const SocialNetworksModal = ({ isOpen, onClose, token, onUpdate }) => {
  const [socialNetworks, setSocialNetworks] = useState([]);
  const [redes, setRedes] = useState([]);
  const [selectedNetwork, setSelectedNetwork] = useState(null);
  const [formData, setFormData] = useState({ red_social_id: '', url: '', identifier: '' });
  const [errors, setErrors] = useState([]);
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const toastRef = useRef(null);

  // Show success toast when successMessage changes
  useEffect(() => {
    if (successMessage) {
      if (toastRef.current) {
        toastRef.current.addToast(successMessage, 'success');
      }
      const timer = setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Show error toasts when errors array changes
  useEffect(() => {
    if (errors.length > 0) {
      if (toastRef.current) {
        errors.forEach(err => {
          toastRef.current.addToast(err, 'error');
        });
      }
      // Clear errors after showing toasts to avoid repeated toasts
      setErrors([]);
    }
  }, [errors]);

  // Show server error toast when serverError changes
  useEffect(() => {
    if (serverError) {
      if (toastRef.current) {
        toastRef.current.addToast(serverError, 'error');
      }
      // Clear serverError after showing toast
      setServerError('');
    }
  }, [serverError]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (toastRef.current && typeof toastRef.current.clearToasts === 'function') {
        toastRef.current.clearToasts();
      }
      setErrors([]);
      setServerError('');
      setSuccessMessage('');
      resetForm();
      setSelectedNetwork(null);
      fetchRedesAsesor();
      fetchRedesSociales();
    }
  }, [isOpen]);

  const fetchRedesAsesor = async () => {
    try {
      const response = await fetch('/api/redesasesor', {
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!response.ok) {
        throw new Error('Error al cargar las redes del asesor');
      }
      const data = await response.json();
      setSocialNetworks(data);
    } catch (error) {
      setServerError(error.message);
    }
  };

  const handleUpdate = () => {
    fetchRedesAsesor();
  };

  const fetchRedesSociales = async () => {
    try {
      const response = await fetch('/api/redessocial');
      if (!response.ok) {
        throw new Error('Error al cargar las redes sociales');
      }
      const data = await response.json();
      setRedes(data);
    } catch (error) {
      setServerError(error.message);
    }
  };

  const resetForm = () => {
    setFormData({ red_social_id: '', url: '', identifier: '' });
    setErrors([]);
    setServerError('');
    setSuccessMessage('');
  };

  const handleSelectNetwork = (network) => {
    setSelectedNetwork(network);
    setFormData({
      red_social_id: network.red_social_id,
      url: network.url || '',
      identifier: network.contenido || ''
    });
    setErrors([]);
    setServerError('');
    setSuccessMessage('');
  };

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

  const handleDelete = async () => {
    if (!selectedNetwork) return;
    if (!window.confirm('¿Está seguro de eliminar esta red social?')) return;
    try {
      const response = await fetch('/api/redesasesor/' + selectedNetwork.id, {
        method: 'DELETE',
        headers: { Authorization: 'Bearer ' + token }
      });
      if (!response.ok) {
        const data = await response.json();
        setServerError(data.error || 'Error al eliminar la red social');
        return;
      }
      setSocialNetworks(socialNetworks.filter((sn) => sn.id !== selectedNetwork.id));
      setSuccessMessage('Red social eliminada correctamente');
      onUpdate();
      setSelectedNetwork(null);
      resetForm();
    } catch (error) {
      setServerError('Error al eliminar la red social');
    }
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
      const method = selectedNetwork ? 'PUT' : 'POST';
      const url = selectedNetwork ? '/api/redesasesor/' + selectedNetwork.id : '/api/redesasesor';
      const body = JSON.stringify({
        red_social_id: formData.red_social_id,
        url: formData.url,
        identifier: formData.identifier
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
        if (data.errors && Array.isArray(data.errors)) {
          const errorMessages = data.errors.map(err => err.msg).join(', ');
          setErrors([errorMessages]);
        } else if (data.error) {
          setServerError(data.error);
        } else {
          setServerError('Error al guardar la red social');
        }
        return;
      }
      const savedNetwork = await response.json();
      let updatedNetworks;
      if (selectedNetwork) {
        updatedNetworks = socialNetworks.map((sn) => {
          if (sn.id === savedNetwork.id) {
            // Merge existing icono and color to updated object to preserve them
            return {
              ...savedNetwork,
              icono: sn.icono,
              color: sn.color,
              nombre: sn.nombre
            };
          }
          return sn;
        });
      } else {
        updatedNetworks = [...socialNetworks, savedNetwork];
      }
      setSocialNetworks(updatedNetworks);
      setSuccessMessage('Red social guardada correctamente');
      onUpdate();
      setSelectedNetwork(null);
      resetForm();
    } catch (error) {
      setServerError('Error al guardar la red social');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer ref={toastRef} />
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content social-networks-modal" onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '20px', minWidth: '600px', maxWidth: '900px' }}>
          <div className="social-networks-list" style={{ flex: 1, overflowY: 'auto', maxHeight: '400px', borderRight: '1px solid #ccc', paddingRight: '10px' }}>
            {socialNetworks.length === 0 ? (
              <div style={{ textAlign: 'center', marginTop: '50%', color: '#666' }}>
                No hay redes sociales asociadas.
              </div>
            ) : (
              socialNetworks.map((sn) => {
                const IconComponent = iconMap[sn.icono] || null;
                const contentText = `${sn.contenido || ''} ${sn.url || ''}`.trim();
                return (
                  <HorizontalInfoCard
                    key={sn.id}
                    icon={IconComponent ? <IconComponent style={{ color: sn.color || '#000' }} /> : null}
                    title={sn.nombre}
                    content={contentText}
                    onClick={() => handleSelectNetwork(sn)}
                    color={sn.color || '#000'}
                  />
                );
              })
            )}
            <button
              style={{ marginTop: '10px', width: '100%', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '8px', cursor: 'pointer' }}
              onClick={() => setIsAddModalOpen(true)}
            >
              Añadir Red Social
            </button>
          </div>
          <div className="social-network-edit" style={{ flex: 1, paddingLeft: '10px' }}>
            {selectedNetwork ? (
              <>
                <h3>Editar Red Social</h3>
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
                    <button type="submit">Actualizar</button>
                    <button type="button" onClick={() => { resetForm(); setSelectedNetwork(null); }}>Cancelar</button>
                    <button type="button" onClick={handleDelete} style={{ marginLeft: 'auto', color: 'red' }}>Eliminar</button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', marginTop: '50%', color: '#666' }}>
                Seleccione una red social para editar.
              </div>
            )}
          </div>
        </div>
      </div>
      <AddSocialNetworkModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        redes={redes}
        token={token}
        onUpdate={() => {
          setIsAddModalOpen(false);
          handleUpdate();
          onUpdate();
        }}
      />
    </>
  );
};

export default SocialNetworksModal;
