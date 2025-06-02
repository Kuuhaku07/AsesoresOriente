import React from 'react';

const CharacteristicsSection = ({
  caracteristicas,
  filteredCaracteristicas,
  caracteristicaSearch,
  setCaracteristicaSearch,
  formData,
  setFormData,
  handleAddCustomCharacteristic,
  handleCustomCharacteristicChange,
  handleRemoveCustomCharacteristic
}) => {
  return (
    <section className="form-section">
      <h2>Características</h2>
      
      <div className="caracteristicas-search">
        <input
          type="text"
          placeholder="Buscar características..."
          value={caracteristicaSearch}
          onChange={(e) => setCaracteristicaSearch(e.target.value)}
        />
      </div>
      
      <div className="caracteristicas-container">
        <h3>Características predefinidas</h3>
        <div className="caracteristicas-grid">
          {filteredCaracteristicas.map((carac) => (
            <div key={carac.id} className="caracteristica-item">
              <label className="caracteristica-label">{carac.nombre}:</label>
              {carac.tipo === 'boolean' ? (
                <label className="checkbox-label caracteristica-checkbox">
                  <input
                    type="checkbox"
                    checked={formData.caracteristicas.some(c => c.caracteristicaId === carac.id && c.valor === 'true')}
                    onChange={(e) => {
                      const checked = e.target.checked;
                      setFormData((prev) => {
                        const exists = prev.caracteristicas.find((c) => c.caracteristicaId === carac.id);
                        let newCaracteristicas;
                        
                        if (exists) {
                          if (checked) {
                            newCaracteristicas = prev.caracteristicas.map((c) =>
                              c.caracteristicaId === carac.id ? { ...c, valor: 'true' } : c
                            );
                          } else {
                            newCaracteristicas = prev.caracteristicas.filter(c => c.caracteristicaId !== carac.id);
                          }
                        } else {
                          newCaracteristicas = [...prev.caracteristicas, { 
                            caracteristicaId: carac.id, 
                            valor: 'true', 
                            cantidad: null 
                          }];
                        }
                        
                        return { ...prev, caracteristicas: newCaracteristicas };
                      });
                    }}
                  />
                  <span className="checkbox-custom"></span>
                </label>
              ) : (
                <input
                  type={carac.tipo === 'number' ? 'number' : 'text'}
                  placeholder={carac.tipo === 'number' ? '0' : 'Valor'}
                  value={
                    formData.caracteristicas.find(c => c.caracteristicaId === carac.id)?.valor || ''
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData((prev) => {
                      const exists = prev.caracteristicas.find((c) => c.caracteristicaId === carac.id);
                      let newCaracteristicas;
                      
                      if (exists) {
                        newCaracteristicas = prev.caracteristicas.map((c) =>
                          c.caracteristicaId === carac.id ? { ...c, valor: value } : c
                        );
                      } else {
                        newCaracteristicas = [...prev.caracteristicas, { 
                          caracteristicaId: carac.id, 
                          valor: value, 
                          cantidad: null 
                        }];
                      }
                      
                      return { ...prev, caracteristicas: newCaracteristicas };
                    });
                  }}
                  min={carac.tipo === 'number' ? '0' : undefined}
                  step={carac.tipo === 'number' ? '1' : undefined}
                />
              )}
            </div>
          ))}
        </div>
        
        <div className="caracteristicas-personalizadas">
          <h3>
            Características personalizadas
            <button 
              type="button" 
              className="btn-add"
              onClick={handleAddCustomCharacteristic}
            >
              + Agregar
            </button>
          </h3>
          
          {formData.caracteristicasPersonalizadas.length === 0 ? (
            <p className="no-custom-message">No hay características personalizadas agregadas</p>
          ) : (
            <div className="custom-caracteristicas-list">
              {formData.caracteristicasPersonalizadas.map((carac) => (
                <div key={carac.id} className="custom-caracteristica-item">
                  <input
                    type="text"
                    value={carac.nombre}
                    onChange={(e) => handleCustomCharacteristicChange(carac.id, 'nombre', e.target.value)}
                    placeholder="Nombre de la característica"
                  />
                  <input
                    type="text"
                    value={carac.valor}
                    onChange={(e) => handleCustomCharacteristicChange(carac.id, 'valor', e.target.value)}
                    placeholder="Valor"
                  />
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => handleRemoveCustomCharacteristic(carac.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CharacteristicsSection;
