import React from 'react';
import Autocomplete from '../Autocomplete';

const BasicInfoSection = ({
  formData,
  handleChange,
  tipoInmuebles,
  estadoInmuebles,
  asesores,
  user,
  handlePropietarioTipoChange,
  selectedPropietario,
  setSelectedPropietario,
  setShowPropietarioForm,
  setIsEditingPropietario,
  newPropietario,
  setNewPropietario,
  handleEditPropietarioClick,
  handlePropietarioInputChange,
  handleSelectPropietario,
  fetchPropietarios,
}) => {
  return (
    <section className="form-section">
      <h2>Información Básica</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>
            Código*:
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              placeholder="Ej: PRO-001"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Título*:
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleChange}
              required
              placeholder="Ej: Hermosa casa en zona residencial"
            />
          </label>
        </div>

        <div className="form-group span-2">
          <label>
            Descripción*:
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describa el inmueble en detalle..."
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Tipo de Inmueble*:
            <select
              name="tipoInmuebleId"
              value={formData.tipoInmuebleId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              {tipoInmuebles.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-group">
          <label>
            Estado del Inmueble*:
            <select
              name="estadoInmuebleId"
              value={formData.estadoInmuebleId}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione...</option>
              {estadoInmuebles.map((estado) => (
                <option key={estado.id} value={estado.id} style={{ color: estado.color }}>
                  {estado.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-group">
          <label>
            Asesor*:
            <select
              name="asesorId"
              value={formData.asesorId}
              onChange={handleChange}
              required
              disabled={user && user.role === 'ASESOR'}
            >
              <option value="">Seleccione...</option>
              {asesores.map((asesor) => (
                <option key={asesor.id} value={asesor.id}>
                  {asesor.nombre}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="form-group span-2">
          <fieldset className="propietario-fieldset">
            <legend>Propietario*</legend>
            <div className="propietario-type">
              <label>
                <input
                  type="radio"
                  name="propietarioTipo"
                  value="persona"
                  checked={formData.propietarioTipo === 'persona'}
                  onChange={(e) => {
                    handlePropietarioTipoChange(e);
                    setSelectedPropietario(null);
                    setShowPropietarioForm(false);
                  }}
                />
                Persona
              </label>
              <label>
                <input
                  type="radio"
                  name="propietarioTipo"
                  value="empresa"
                  checked={formData.propietarioTipo === 'empresa'}
                  onChange={(e) => {
                    handlePropietarioTipoChange(e);
                    setSelectedPropietario(null);
                    setShowPropietarioForm(false);
                  }}
                />
                Empresa
              </label>
              <button
                type="button"
                className="btn-add"
                onClick={() => {
                  setShowPropietarioForm(true);
                  setIsEditingPropietario(false);
                  setSelectedPropietario(null);
                  setNewPropietario({
                    tipo: formData.propietarioTipo,
                    nombre: '',
                    apellido: '',
                    documento: '',
                    telefono: '',
                    correo: '',
                    direccion: '',
                    empresaNombre: '',
                    rif: '',
                    representanteLegal: '',
                    fechaNacimiento: '',
                    estadoCivilId: '',
                    notas: '',
                  });
                }}
              >
                + Registrar Nuevo
              </button>
              <button
                type="button"
                className="btn-edit"
                onClick={handleEditPropietarioClick}
                disabled={!selectedPropietario}
                style={{ marginLeft: '8px' }}
              >
                Editar
              </button>
            </div>
            <Autocomplete
              value={
                selectedPropietario
                  ? formData.propietarioTipo === 'persona'
                    ? `${selectedPropietario.nombre} ${selectedPropietario.apellido} (${selectedPropietario.documento})`
                    : `${selectedPropietario.nombre} (${selectedPropietario.rif})`
                  : ''
              }
              onChange={handlePropietarioInputChange}
              onSelect={handleSelectPropietario}
              fetchOptions={fetchPropietarios}
              placeholder={formData.propietarioTipo === 'persona' ? 'Buscar persona...' : 'Buscar empresa...'}
              disabled={false}
            />
          </fieldset>
        </div>
      </div>
    </section>
  );
};

export default BasicInfoSection;
