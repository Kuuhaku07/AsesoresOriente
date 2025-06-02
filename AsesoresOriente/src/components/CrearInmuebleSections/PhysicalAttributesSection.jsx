import React from 'react';

const PhysicalAttributesSection = ({ formData, handleChange }) => {
  return (
    <section className="form-section">
      <h2>Atributos Físicos</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>
            Área Construida* (m²):
            <input 
              type="number" 
              name="areaConstruida" 
              value={formData.areaConstruida} 
              onChange={handleChange} 
              min="0" 
              step="0.01" 
              required 
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Área Terreno* (m²):
            <input 
              type="number" 
              name="areaTerreno" 
              value={formData.areaTerreno} 
              onChange={handleChange} 
              min="0" 
              step="0.01" 
              required 
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Habitaciones:
            <input 
              type="number" 
              name="habitaciones" 
              value={formData.habitaciones} 
              onChange={handleChange} 
              min="0" 
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Baños:
            <input 
              type="number" 
              name="banos" 
              value={formData.banos} 
              onChange={handleChange} 
              min="0" 
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Estacionamientos:
            <input 
              type="number" 
              name="estacionamientos" 
              value={formData.estacionamientos} 
              onChange={handleChange} 
              min="0" 
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Niveles:
            <input 
              type="number" 
              name="niveles" 
              value={formData.niveles} 
              onChange={handleChange} 
              min="1" 
            />
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Año de Construcción:
            <input 
              type="number" 
              name="anoConstruccion" 
              value={formData.anoConstruccion} 
              onChange={handleChange} 
              min="1800" 
              max={new Date().getFullYear()} 
            />
          </label>
        </div>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="amueblado" 
              checked={formData.amueblado} 
              onChange={handleChange} 
            />
            <span className="checkbox-custom"></span>
            Amueblado
          </label>
        </div>
        
        <div className="form-group checkbox-group">
          <label className="checkbox-label">
            <input 
              type="checkbox" 
              name="climatizado" 
              checked={formData.climatizado} 
              onChange={handleChange} 
            />
            <span className="checkbox-custom"></span>
            Climatizado
          </label>
        </div>
      </div>
    </section>
  );
};

export default PhysicalAttributesSection;
