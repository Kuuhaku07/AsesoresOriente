import React, { useState } from 'react';
import CaracteristicaModal from './CaracteristicaModal';

const CharacteristicsSection = ({
  filteredCaracteristicas,
  caracteristicaSearch,
  setCaracteristicaSearch,
  formData,
  setFormData,
  tipoCaracteristicasOptions,
  refreshCaracteristicas,
}) => {
  console.log('CharacteristicsSection props:', { filteredCaracteristicas, tipoCaracteristicasOptions, formData });
  const [showCaracteristicaModal, setShowCaracteristicaModal] = React.useState(false);
  const [isEditingCaracteristica, setIsEditingCaracteristica] = React.useState(false);
  const [currentCaracteristica, setCurrentCaracteristica] = React.useState({
    id: null,
    nombre: '',
    tipo_id: '',
    descripcion: '',
  });

  // New state to track selected characteristic for editing
  const [selectedCaracteristicaId, setSelectedCaracteristicaId] = React.useState(null);

  const openNewCaracteristicaModal = () => {
    setCurrentCaracteristica({
      id: null,
      nombre: '',
      tipo_id: '',
      descripcion: '',
    });
    setIsEditingCaracteristica(false);
    setShowCaracteristicaModal(true);
  };

  const openEditCaracteristicaModal = async () => {
    if (!selectedCaracteristicaId) return;
    try {
      const response = await fetch(`/api/inmueble/caracteristicas/${selectedCaracteristicaId}`);
      if (!response.ok) {
        throw new Error('Error fetching característica details');
      }
      const carac = await response.json();
      setCurrentCaracteristica({
        id: carac.id,
        nombre: carac.nombre,
        tipo_id: carac.tipo_id || '',
        descripcion: carac.descripcion || '',
      });
      setIsEditingCaracteristica(true);
      setShowCaracteristicaModal(true);
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCaracteristicaChange = (e) => {
    const { name, value } = e.target;
    setCurrentCaracteristica((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveCaracteristica = async () => {
    const { id, nombre, tipo_id, descripcion } = currentCaracteristica;
    if (!nombre || !tipo_id) return;

    try {
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/inmueble/caracteristicas/${id}` : '/api/inmueble/caracteristicas';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, tipo_id, descripcion }),
      });
      if (!response.ok) {
        throw new Error('Error saving característica');
      }
      const savedCaracteristica = await response.json();

      // Update formData caracteristicas list
      setFormData((prev) => {
        let newCaracteristicas;
        if (id) {
          // Update existing
          newCaracteristicas = prev.caracteristicas.map((c) =>
            c.caracteristicaId === savedCaracteristica.id
              ? { ...c, caracteristicaId: savedCaracteristica.id, nombre: savedCaracteristica.nombre, tipo_id: savedCaracteristica.tipo_id, descripcion: savedCaracteristica.descripcion }
              : c
          );
        } else {
          // Add new
          newCaracteristicas = [...prev.caracteristicas, { caracteristicaId: savedCaracteristica.id, nombre: savedCaracteristica.nombre, tipo_id: savedCaracteristica.tipo_id, descripcion: savedCaracteristica.descripcion, valor: '', cantidad: null }];
        }
        return { ...prev, caracteristicas: newCaracteristicas };
      });

      setShowCaracteristicaModal(false);
      // Clear selection after save
      setSelectedCaracteristicaId(null);

      // Refresh characteristics list in parent component
      if (typeof refreshCaracteristicas === 'function') {
        await refreshCaracteristicas();

        // After refreshing characteristics list, update filteredCaracteristicas state to reflect new data
        setFilteredCaracteristicas((prevFiltered) => {
          const updatedFiltered = [...prevFiltered];
          // Replace with fresh data from parent (assumed to be updated by refreshCaracteristicas)
          // This assumes parent passes updated filteredCaracteristicas prop after refresh
          return updatedFiltered;
        });

        // After refreshing characteristics list, update formData.caracteristicas to sync with updated types
        setFormData((prev) => {
          const updatedCaracteristicas = prev.caracteristicas.map((c) => {
            const updatedCarac = filteredCaracteristicas.find(fc => fc.id === c.caracteristicaId);
            if (updatedCarac) {
              return {
                ...c,
                nombre: updatedCarac.nombre,
                tipo_id: updatedCarac.tipo_id,
                descripcion: updatedCarac.descripcion,
              };
            }
            return c;
          });
          return { ...prev, caracteristicas: updatedCaracteristicas };
        });
      }
    } catch (error) {
      alert(error.message);
    }
  };

  // Handle selecting a characteristic item
  const handleSelectCaracteristica = (id) => {
    setSelectedCaracteristicaId(id === selectedCaracteristicaId ? null : id);
  };

  return (
    <section className="form-section">
      <h2>Características</h2>

      <div className="caracteristicas-search" style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Buscar características..."
          value={caracteristicaSearch}
          onChange={(e) => setCaracteristicaSearch(e.target.value)}
          style={{ flexGrow: 1 }}
        />
        <button type="button" className="btn-primary" onClick={openNewCaracteristicaModal} style={{ marginLeft: '10px' }}>
          + Nueva Característica
        </button>
        <button
          type="button"
          className="btn-primary"
          onClick={openEditCaracteristicaModal}
          disabled={!selectedCaracteristicaId}
          style={{ marginLeft: '10px' }}
        >
          Editar
        </button>
      </div>

      <div className="caracteristicas-container">
        <h3>Características predefinidas</h3>
        <div className="caracteristicas-grid">
          {filteredCaracteristicas.map((carac) => (
            <div
              key={carac.id}
              className={`caracteristica-item${selectedCaracteristicaId === carac.id ? ' selected' : ''}`}
              onClick={() => handleSelectCaracteristica(carac.id)}
              style={{
                cursor: 'pointer',
                userSelect: 'none',
                padding: '8px',
                marginBottom: '6px',
                borderRadius: '4px',
                border: selectedCaracteristicaId === carac.id ? '2px solid #007bff' : '1px solid #ccc',
                backgroundColor: selectedCaracteristicaId === carac.id ? '#e7f1ff' : 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <label className="caracteristica-label" style={{ margin: 0 }}>{carac.nombre}:</label>
              <label className="checkbox-label caracteristica-checkbox" onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={formData.caracteristicas.some(c => c.caracteristicaId === carac.id && c.tiene === true)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => {
                      const exists = prev.caracteristicas.find((c) => c.caracteristicaId === carac.id);
                      let newCaracteristicas;

                      if (exists) {
                        if (checked) {
                          newCaracteristicas = prev.caracteristicas.map((c) =>
                            c.caracteristicaId === carac.id ? { ...c, tiene: true } : c
                          );
                        } else {
                          newCaracteristicas = prev.caracteristicas.filter(c => c.caracteristicaId !== carac.id);
                        }
                      } else {
                        newCaracteristicas = [...prev.caracteristicas, {
                          caracteristicaId: carac.id,
                          tiene: true,
                          cantidad: null
                        }];
                      }

                      return { ...prev, caracteristicas: newCaracteristicas };
                    });
                  }}
                />
                <span className="checkbox-custom"></span>
              </label>
              {(() => {
                const tipoCarac = tipoCaracteristicasOptions.find(t => t.id === carac.tipo_id);
                if (tipoCarac && tipoCarac.unidad_medida) {
                  const caracteristicaData = formData.caracteristicas.find(c => c.caracteristicaId === carac.id);
                  if (caracteristicaData && caracteristicaData.tiene === true) {
                    return (
                      <input
                        type="number"
                        min="0"
                        step="any"
                        value={caracteristicaData ? (caracteristicaData.cantidad || '') : ''}
                        onChange={(e) => {
                          const value = e.target.value;
                          setFormData((prev) => {
                            const exists = prev.caracteristicas.find(c => c.caracteristicaId === carac.id);
                            let newCaracteristicas;
                            if (exists) {
                              newCaracteristicas = prev.caracteristicas.map(c =>
                                c.caracteristicaId === carac.id ? { ...c, cantidad: value } : c
                              );
                            } else {
                              newCaracteristicas = [...prev.caracteristicas, {
                                caracteristicaId: carac.id,
                                tiene: false,
                                cantidad: value
                              }];
                            }
                            return { ...prev, caracteristicas: newCaracteristicas };
                          });
                        }}
                        style={{ width: '80px', marginLeft: '8px' }}
                        placeholder={tipoCarac.unidad_medida}
                      />
                    );
                  }
                }
                return null;
              })()}
            </div>
          ))}
        </div>
      </div>

      <CaracteristicaModal
        isOpen={showCaracteristicaModal}
        onClose={() => setShowCaracteristicaModal(false)}
        isEditing={isEditingCaracteristica}
        caracteristica={currentCaracteristica}
        handleCaracteristicaChange={handleCaracteristicaChange}
        handleSaveCaracteristica={handleSaveCaracteristica}
        tipoCaracteristicasOptions={tipoCaracteristicasOptions}
      />
    </section>
  );
};

export default CharacteristicsSection;
