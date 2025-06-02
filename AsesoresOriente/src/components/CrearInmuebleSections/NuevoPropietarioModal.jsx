import React from 'react';
import PropTypes from 'prop-types';

const NuevoPropietarioModal = ({
  isOpen,
  onClose,
  isEditing,
  newPropietario,
  handleNewPropietarioChange,
  handleSaveNewPropietario,
  estadoCivilOptions,
}) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{isEditing ? 'Editar Propietario' : 'Registrar Nuevo Propietario'}</h2>
        
        {!isEditing ? (
          <div className="modal-tabs">
            <button 
              type="button"
              className={newPropietario.tipo === 'persona' ? 'active' : ''}
              onClick={() => handleNewPropietarioChange({ target: { name: 'tipo', value: 'persona' } })}
              disabled={isEditing}
            >
              Persona
            </button>
            <button 
              type="button"
              className={newPropietario.tipo === 'empresa' ? 'active' : ''}
              onClick={() => handleNewPropietarioChange({ target: { name: 'tipo', value: 'empresa' } })}
              disabled={isEditing}
            >
              Empresa
            </button>
          </div>
        ) : (
          <div className="modal-edit-type-label">
            <label>Tipo de Propietario: {newPropietario.tipo === 'persona' ? 'Persona' : 'Empresa'}</label>
          </div>
        )}
        
        {newPropietario.tipo === 'persona' ? (
          <div className="persona-form">
            <div className="form-group">
              <label>Nombre*:</label>
              <input 
                type="text" 
                name="nombre" 
                value={newPropietario.nombre} 
                onChange={handleNewPropietarioChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Apellido*:</label>
              <input 
                type="text" 
                name="apellido" 
                value={newPropietario.apellido} 
                onChange={handleNewPropietarioChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Documento de Identidad*:</label>
              <input 
                type="text" 
                name="documento" 
                value={newPropietario.documento} 
                onChange={handleNewPropietarioChange} 
                required 
                placeholder="Ej: V12345678"
              />
            </div>
            
            <div className="form-group">
              <label>Teléfono*:</label>
              <input 
                type="text" 
                name="telefono" 
                value={newPropietario.telefono} 
                onChange={handleNewPropietarioChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Correo Electrónico:</label>
              <input 
                type="email" 
                name="correo" 
                value={newPropietario.correo} 
                onChange={handleNewPropietarioChange} 
              />
            </div>
            
            <div className="form-group">
              <label>Dirección:</label>
              <textarea 
                name="direccion" 
                value={newPropietario.direccion} 
                onChange={handleNewPropietarioChange} 
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Fecha de Nacimiento:</label>
              <input
                type="date"
                name="fechaNacimiento"
                value={newPropietario.fechaNacimiento}
                onChange={handleNewPropietarioChange}
              />
            </div>
            <div className="form-group">
              <label>Estado Civil:</label>
              <select
                name="estadoCivilId"
                value={newPropietario.estadoCivilId}
                onChange={handleNewPropietarioChange}
              >
                <option value="">Seleccione...</option>
                {estadoCivilOptions.map((estadoCivil) => (
                  <option key={estadoCivil.id} value={estadoCivil.id}>
                    {estadoCivil.nombre}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Notas:</label>
              <textarea
                name="notas"
                value={newPropietario.notas}
                onChange={handleNewPropietarioChange}
                rows="3"
              />
            </div>
          </div>
        ) : (
          <div className="empresa-form">
            <div className="form-group">
              <label>Nombre de la Empresa*:</label>
              <input 
                type="text" 
                name="empresaNombre" 
                value={newPropietario.empresaNombre} 
                onChange={handleNewPropietarioChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>RIF*:</label>
              <input 
                type="text" 
                name="rif" 
                value={newPropietario.rif} 
                onChange={handleNewPropietarioChange} 
                required 
                placeholder="Ej: J-123456789"
              />
            </div>
            
            <div className="form-group">
              <label>Representante Legal:</label>
              <input 
                type="text" 
                name="representanteLegal" 
                value={newPropietario.representanteLegal} 
                onChange={handleNewPropietarioChange} 
              />
            </div>
            
            <div className="form-group">
              <label>Teléfono*:</label>
              <input 
                type="text" 
                name="telefono" 
                value={newPropietario.telefono} 
                onChange={handleNewPropietarioChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Correo Electrónico:</label>
              <input 
                type="email" 
                name="correo" 
                value={newPropietario.correo} 
                onChange={handleNewPropietarioChange} 
              />
            </div>
            
            <div className="form-group">
              <label>Dirección:</label>
              <textarea 
                name="direccion" 
                value={newPropietario.direccion} 
                onChange={handleNewPropietarioChange} 
                rows="3"
              />
            </div>
            <div className="form-group">
              <label>Notas:</label>
              <textarea
                name="notas"
                value={newPropietario.notas}
                onChange={handleNewPropietarioChange}
                rows="3"
              />
            </div>
          </div>
        )}
        
        <div className="modal-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button 
            type="button" 
            className="btn-primary"
            onClick={handleSaveNewPropietario}
            disabled={
              newPropietario.tipo === 'persona' 
                ? !newPropietario.nombre || !newPropietario.apellido || !newPropietario.documento || !newPropietario.telefono
                : !newPropietario.empresaNombre || !newPropietario.rif || !newPropietario.telefono
            }
          >
            Guardar Propietario
          </button>
        </div>
      </div>
    </div>
  );
};

NuevoPropietarioModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  isEditing: PropTypes.bool.isRequired,
  newPropietario: PropTypes.object.isRequired,
  handleNewPropietarioChange: PropTypes.func.isRequired,
  handleSaveNewPropietario: PropTypes.func.isRequired,
  estadoCivilOptions: PropTypes.array.isRequired,
};

export default NuevoPropietarioModal;
