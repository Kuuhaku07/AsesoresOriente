import React, { useState, useEffect, useRef } from 'react';
import PageTemplate from '../components/PageTemplate';
import ToastContainer from '../components/ToastContainer';
import ImageGallery from '../components/ImageGallery';
import DocumentList from '../components/DocumentList';
import '../styles/Register.css';
import '../styles/CrearInmueble.css';

const CrearInmueble = () => {
  const toastRef = useRef(null);

  // State for form fields
  const [formData, setFormData] = useState({
    codigo: '',
    titulo: '',
    descripcion: '',
    tipoInmuebleId: '',
    estadoInmuebleId: '',
    asesorId: '',
    propietarioTipo: 'persona', // 'persona' or 'empresa'
    propietarioId: '',
    areaConstruida: '',
    areaTerreno: '',
    habitaciones: 0,
    banos: 0,
    estacionamientos: 0,
    niveles: 1,
    anoConstruccion: '',
    amueblado: false,
    climatizado: false,
    zonaId: '',
    direccionExacta: '',
    referencia: '',
    coordenadas: '',
    tipoNegocios: [], // { tipoNegocioId, precio, moneda }
    caracteristicas: [], // { caracteristicaId, valor, cantidad }
    imagenes: [], // array of { file, preview, es_portada, titulo, descripcion }
    documentos: [], // array of { file, nombre }
  });

  // State for dropdown options
  const [tipoInmuebles, setTipoInmuebles] = useState([]);
  const [estadoInmuebles, setEstadoInmuebles] = useState([]);
  const [asesores, setAsesores] = useState([]);
  const [propietariosPersona, setPropietariosPersona] = useState([]);
  const [propietariosEmpresa, setPropietariosEmpresa] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [tipoNegocios, setTipoNegocios] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);

  // Fetch dropdown data on mount (mocked here, replace with API calls)
  useEffect(() => {
    setTipoInmuebles([
      { id: 1, nombre: 'Casa' },
      { id: 2, nombre: 'Apartamento' },
    ]);
    setEstadoInmuebles([
      { id: 1, nombre: 'Disponible' },
      { id: 2, nombre: 'Vendido' },
    ]);
    setAsesores([
      { id: 1, nombre: 'Juan Perez' },
      { id: 2, nombre: 'Maria Gomez' },
    ]);
    setPropietariosPersona([
      { id: 1, nombre: 'Carlos Lopez' },
      { id: 2, nombre: 'Ana Torres' },
    ]);
    setPropietariosEmpresa([
      { id: 1, nombre: 'Inmobiliaria XYZ' },
      { id: 2, nombre: 'Constructora ABC' },
    ]);
    setZonas([
      { id: 1, nombre: 'Zona Centro' },
      { id: 2, nombre: 'Zona Norte' },
    ]);
    setTipoNegocios([
      { id: 1, nombre: 'Venta' },
      { id: 2, nombre: 'Alquiler' },
    ]);
    setCaracteristicas([
      { id: 1, nombre: 'Piscina' },
      { id: 2, nombre: 'Jardín' },
    ]);
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle propietario type change
  const handlePropietarioTipoChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      propietarioTipo: e.target.value,
      propietarioId: '',
    }));
  };

  // Handle images change from ImageGallery
  const handleImagesChange = (images) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: images,
    }));
  };

  // Handle documents change from DocumentList
  const handleDocumentsChange = (documents) => {
    setFormData((prev) => ({
      ...prev,
      documentos: documents,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.codigo || !formData.titulo) {
      toastRef.current?.addToast('Por favor complete los campos obligatorios.', 'error', 5000);
      return;
    }
    toastRef.current?.addToast('Formulario enviado correctamente (simulado).', 'success', 5000);
  };

  return (
    <PageTemplate pageClass="crear-inmueble-layout" contentClass="crear-inmueble-content" title="Crear Inmueble">
      <form onSubmit={handleSubmit} className="crear-inmueble-form">
        <section>
          <h2>Información Básica</h2>
          <label>
            Código*:
            <input type="text" name="codigo" value={formData.codigo} onChange={handleChange} required />
          </label>
          <label>
            Título*:
            <input type="text" name="titulo" value={formData.titulo} onChange={handleChange} required />
          </label>
          <label>
            Descripción*:
            <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} required />
          </label>
          <label>
            Tipo de Inmueble*:
            <select name="tipoInmuebleId" value={formData.tipoInmuebleId} onChange={handleChange} required>
              <option value="">Seleccione</option>
              {tipoInmuebles.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
              ))}
            </select>
          </label>
          <label>
            Estado del Inmueble*:
            <select name="estadoInmuebleId" value={formData.estadoInmuebleId} onChange={handleChange} required>
              <option value="">Seleccione</option>
              {estadoInmuebles.map((estado) => (
                <option key={estado.id} value={estado.id}>{estado.nombre}</option>
              ))}
            </select>
          </label>
          <label>
            Asesor*:
            <select name="asesorId" value={formData.asesorId} onChange={handleChange} required>
              <option value="">Seleccione</option>
              {asesores.map((asesor) => (
                <option key={asesor.id} value={asesor.id}>{asesor.nombre}</option>
              ))}
            </select>
          </label>
          <fieldset>
            <legend>Propietario*</legend>
            <label>
              <input
                type="radio"
                name="propietarioTipo"
                value="persona"
                checked={formData.propietarioTipo === 'persona'}
                onChange={handlePropietarioTipoChange}
              />
              Persona
            </label>
            <label>
              <input
                type="radio"
                name="propietarioTipo"
                value="empresa"
                checked={formData.propietarioTipo === 'empresa'}
                onChange={handlePropietarioTipoChange}
              />
              Empresa
            </label>
            {formData.propietarioTipo === 'persona' ? (
              <select name="propietarioId" value={formData.propietarioId} onChange={handleChange} required>
                <option value="">Seleccione Persona</option>
                {propietariosPersona.map((p) => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            ) : (
              <select name="propietarioId" value={formData.propietarioId} onChange={handleChange} required>
                <option value="">Seleccione Empresa</option>
                {propietariosEmpresa.map((e) => (
                  <option key={e.id} value={e.id}>{e.nombre}</option>
                ))}
              </select>
            )}
          </fieldset>
        </section>

        <section>
          <h2>Atributos Físicos</h2>
          <label>
            Área Construida* (m²):
            <input type="number" name="areaConstruida" value={formData.areaConstruida} onChange={handleChange} min="0" step="0.01" required />
          </label>
          <label>
            Área Terreno* (m²):
            <input type="number" name="areaTerreno" value={formData.areaTerreno} onChange={handleChange} min="0" step="0.01" required />
          </label>
          <label>
            Habitaciones:
            <input type="number" name="habitaciones" value={formData.habitaciones} onChange={handleChange} min="0" />
          </label>
          <label>
            Baños:
            <input type="number" name="banos" value={formData.banos} onChange={handleChange} min="0" />
          </label>
          <label>
            Estacionamientos:
            <input type="number" name="estacionamientos" value={formData.estacionamientos} onChange={handleChange} min="0" />
          </label>
          <label>
            Niveles:
            <input type="number" name="niveles" value={formData.niveles} onChange={handleChange} min="1" />
          </label>
          <label>
            Año de Construcción:
            <input type="number" name="anoConstruccion" value={formData.anoConstruccion} onChange={handleChange} min="1800" max={new Date().getFullYear()} />
          </label>
          <label>
            Amueblado:
            <input type="checkbox" name="amueblado" checked={formData.amueblado} onChange={handleChange} />
          </label>
          <label>
            Climatizado:
            <input type="checkbox" name="climatizado" checked={formData.climatizado} onChange={handleChange} />
          </label>
        </section>

        <section>
          <h2>Ubicación</h2>
          <label>
            Zona*:
            <select name="zonaId" value={formData.zonaId} onChange={handleChange} required>
              <option value="">Seleccione</option>
              {zonas.map((zona) => (
                <option key={zona.id} value={zona.id}>{zona.nombre}</option>
              ))}
            </select>
          </label>
          <label>
            Dirección Exacta*:
            <input type="text" name="direccionExacta" value={formData.direccionExacta} onChange={handleChange} required />
          </label>
          <label>
            Referencia:
            <input type="text" name="referencia" value={formData.referencia} onChange={handleChange} />
          </label>
          <label>
            Coordenadas:
            <input type="text" name="coordenadas" value={formData.coordenadas} onChange={handleChange} />
          </label>
        </section>

        <section>
          <h2>Tipos de Negocio y Precios</h2>
          {tipoNegocios.map((tipo) => (
            <div key={tipo.id} className="tipo-negocio-item">
              <label>
                <input
                  type="checkbox"
                  checked={formData.tipoNegocios.some((tn) => tn.tipoNegocioId === tipo.id)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData((prev) => {
                      let newTipoNegocios = [...prev.tipoNegocios];
                      if (checked) {
                        newTipoNegocios.push({ tipoNegocioId: tipo.id, precio: '', moneda: 'USD' });
                      } else {
                        newTipoNegocios = newTipoNegocios.filter((tn) => tn.tipoNegocioId !== tipo.id);
                      }
                      return { ...prev, tipoNegocios: newTipoNegocios };
                    });
                  }}
                />
                {tipo.nombre}
              </label>
              {formData.tipoNegocios.some((tn) => tn.tipoNegocioId === tipo.id) && (
                <>
                  <input
                    type="number"
                    placeholder="Precio"
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
                  />
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
                </>
              )}
            </div>
          ))}
        </section>

        <section>
          <h2>Características</h2>
          {caracteristicas.map((carac) => (
            <div key={carac.id} className="caracteristica-item">
              <label>{carac.nombre}:</label>
              <input
                type="text"
                placeholder="Valor"
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
                      newCaracteristicas = [...prev.caracteristicas, { caracteristicaId: carac.id, valor: value, cantidad: null }];
                    }
                    return { ...prev, caracteristicas: newCaracteristicas };
                  });
                }}
              />
            </div>
          ))}
        </section>

        <section>
          <h2>Imágenes y Documentos</h2>
          <ImageGallery images={formData.imagenes} onChange={handleImagesChange} mode="edit" />
          <DocumentList documents={formData.documentos} onChange={handleDocumentsChange} mode="edit" containerHeight="400px" />
        </section>

        <button type="submit">Crear Inmueble</button>
      </form>
      <ToastContainer ref={toastRef} />
    </PageTemplate>
  );
};

export default CrearInmueble;
