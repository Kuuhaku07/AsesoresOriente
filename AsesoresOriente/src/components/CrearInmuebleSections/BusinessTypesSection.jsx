import React from 'react';

const BusinessTypesSection = ({ tipoNegocios, formData, setFormData }) => {
  return (
    <section className="form-section">
      <h2>Tipos de Negocio y Precios</h2>
      <div className="negocios-container">
        {tipoNegocios.map((tipo) => (
          <div key={tipo.id} className="tipo-negocio-item">
            <div className="tipo-negocio-header">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.tipoNegocios.some((tn) => tn.tipoNegocioId === tipo.id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => {
                      let newTipoNegocios = [...prev.tipoNegocios];
                      if (checked) {
                        newTipoNegocios.push({ 
                          tipoNegocioId: tipo.id, 
                          precio: '', 
                          moneda: 'USD',
                          disponible: true
                        });
                      } else {
                        newTipoNegocios = newTipoNegocios.filter((tn) => tn.tipoNegocioId !== tipo.id);
                      }
                      return { ...prev, tipoNegocios: newTipoNegocios };
                    });
                  }}
                />
                <span className="checkbox-custom"></span>
                {tipo.nombre}
              </label>
            </div>
            
            {formData.tipoNegocios.some((tn) => tn.tipoNegocioId === tipo.id) && (
              <div className="tipo-negocio-details">
                <div className="precio-input">
                  <label>Precio*:</label>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.tipoNegocios.find((tn) => tn.tipoNegocioId === tipo.id)?.precio || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => {
                        const newTipoNegocios = prev.tipoNegocios.map((tn) =>
                          tn.tipoNegocioId === tipo.id ? { ...tn, precio: value } : tn
                        );
                        return { ...prev, tipoNegocios: newTipoNegocios };
                      });
                    }}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                
                <div className="moneda-select">
                  <label>Moneda*:</label>
                  <select
                    value={formData.tipoNegocios.find((tn) => tn.tipoNegocioId === tipo.id)?.moneda || 'USD'}
                    onChange={(e) => {
                      const value = e.target.value;
                      setFormData((prev) => {
                        const newTipoNegocios = prev.tipoNegocios.map((tn) =>
                          tn.tipoNegocioId === tipo.id ? { ...tn, moneda: value } : tn
                        );
                        return { ...prev, tipoNegocios: newTipoNegocios };
                      });
                    }}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="BS">BS</option>
                  </select>
                </div>
                
                <div className="disponible-checkbox">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      checked={formData.tipoNegocios.find((tn) => tn.tipoNegocioId === tipo.id)?.disponible !== false}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setFormData((prev) => {
                          const newTipoNegocios = prev.tipoNegocios.map((tn) =>
                            tn.tipoNegocioId === tipo.id ? { ...tn, disponible: checked } : tn
                          );
                          return { ...prev, tipoNegocios: newTipoNegocios };
                        });
                      }}
                    />
                    <span className="checkbox-custom"></span>
                    Disponible
                  </label>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default BusinessTypesSection;
