import React from 'react';
import Map from '../Map';

const LocationSection = ({ formData, handleChange, estados, ciudades, zonas, setFormData }) => {
                console.log('Rendering zonas:', formData.zonaId);
                console.log('Rendering Ciudades:', formData.ciudadId);
                console.log('Rendering Estados:', formData.estadoId);
  console.log('Rendering estados:', estados);

  return (
    
    <section className="form-section">
      <h2>Ubicación</h2>
      <div className="form-grid">
        <div className="form-group">
          <label>
            Estado*:
            <select 
              name="estadoId" 
              value={formData.estadoId} 
              onChange={handleChange} 
              required
            >

              <option value="">Seleccione...</option>
              {estados.map((estado) => (
                <option key={estado.id} value={estado.id}>{estado.nombre}</option>
              ))}
            </select>
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Ciudad*:
            <select 
              name="ciudadId" 
              value={formData.ciudadId} 
              onChange={handleChange} 
              required
              disabled={!formData.estadoId}
            >
              <option value="">Seleccione...</option>
              {ciudades.map((ciudad) => (
                <option key={ciudad.id} value={ciudad.id}>{ciudad.nombre}</option>
              ))}
            </select>
          </label>
        </div>
        
        <div className="form-group">
          <label>
            Zona*:
            <select 
              name="zonaId" 
              value={formData.zonaId} 
              onChange={handleChange} 
              required
              disabled={!formData.ciudadId}
            >
              <option value="">Seleccione...</option>
              {zonas.map((zona) => (
                <option key={zona.id} value={zona.id}>
                  {zona.nombre} {zona.codigo_postal ? `(${zona.codigo_postal})` : ''}
                </option>
              ))}
            </select>
          </label>
        </div>
        
        <div className="form-group span-2">
          <label>
            Dirección Exacta*:
            <input 
              type="text" 
              name="direccionExacta" 
              value={formData.direccionExacta} 
              onChange={handleChange} 
              required 
              placeholder="Ej: Calle Principal #123, Edificio XYZ, Piso 4"
            />
          </label>
        </div>
        
        <div className="form-group span-2">
          <label>
            Referencia:
            <input 
              type="text" 
              name="referencia" 
              value={formData.referencia} 
              onChange={handleChange} 
              placeholder="Ej: Frente a la plaza principal, al lado del supermercado"
            />
          </label>
        </div>
        
        <div className="form-group span-2">
          <label>
            Coordenadas (opcional):
            <div className="coordenadas-input">
              <input 
                type="text" 
                name="coordenadas" 
                value={formData.coordenadas} 
                onChange={handleChange} 
                placeholder="Ej: 10.123456, -66.987654"
              />
            </div>
          </label>
          <div className="map-preview">
            <Map 
              coordinates={formData.coordenadas}
              onChangeCoordinates={(coords) => {
                setFormData(prev => ({
                  ...prev,
                  coordenadas: coords
                }));
              }}
              height="400px"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationSection;
