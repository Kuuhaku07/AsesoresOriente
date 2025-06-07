import React from 'react';
import PropTypes from 'prop-types';

const CaracteristicaModal = ({
  isOpen,
  onClose,
  isEditing,
  caracteristica,
  handleCaracteristicaChange,
  handleSaveCaracteristica,
  tipoCaracteristicasOptions = [],
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? 'Editar Característica' : 'Registrar Nueva Característica'}</h2>

        <div className="form-group">
          <label>Nombre*:</label>
          <input
            type="text"
            name="nombre"
            value={caracteristica.nombre}
            onChange={handleCaracteristicaChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Tipo*:</label>
          <select
            name="tipo_id"
            value={caracteristica.tipo_id}
            onChange={handleCaracteristicaChange}
            required
          >
            <option value="">Seleccione...</option>
            {tipoCaracteristicasOptions.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            name="descripcion"
            value={caracteristica.descripcion || ''}
            onChange={handleCaracteristicaChange}
            rows="3"
          />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={handleSaveCaracteristica}
            disabled={!caracteristica.nombre || !caracteristica.tipo_id}
          >
            Guardar Característica
          </button>
        </div>
      </div>
    </div>
  );
};

CaracteristicaModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  caracteristica: PropTypes.object.isRequired,
  handleCaracteristicaChange: PropTypes.func.isRequired,
  handleSaveCaracteristica: PropTypes.func.isRequired,
  tipoCaracteristicasOptions: PropTypes.array.isRequired,
};

export default CaracteristicaModal;
