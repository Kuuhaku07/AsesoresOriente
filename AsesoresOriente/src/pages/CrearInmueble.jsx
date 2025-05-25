import React, { useState, useEffect, useRef } from 'react';
import PageTemplate from '../components/PageTemplate';
import ToastContainer from '../components/ToastContainer';
import ImageGallery from '../components/ImageGallery';
import DocumentList from '../components/DocumentList';
import '../styles/Register.css';
import '../styles/CrearInmueble.css';
import Map from '../components/Map';

const CrearInmueble = () => {
  // Referencia para mostrar notificaciones toast
  const toastRef = useRef(null);
  
  // Estado para controlar la pestaña activa
  const [activeTab, setActiveTab] = useState('basica');
  
  // Estado para controlar la pestaña activa en multimedia
  const [activeMultimediaTab, setActiveMultimediaTab] = useState('imagenes');
  
  // Estado para mostrar/ocultar el formulario de nuevo propietario
  const [showPropietarioForm, setShowPropietarioForm] = useState(false);
  
  // Estado para el nuevo propietario
  const [newPropietario, setNewPropietario] = useState({
    tipo: 'persona',
    nombre: '',
    apellido: '',
    documento: '',
    telefono: '',
    correo: '',
    direccion: '',
    empresaNombre: '',
    rif: '',
    representanteLegal: ''
  });

  // Estado principal del formulario
  const [formData, setFormData] = useState({
    codigo: '',
    titulo: '',
    descripcion: '',
    tipoInmuebleId: '',
    estadoInmuebleId: '',
    asesorId: '',
    propietarioTipo: 'persona',
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
    estadoId: '',
    ciudadId: '',
    zonaId: '',
    direccionExacta: '',
    referencia: '',
    coordenadas: '',
    tipoNegocios: [],
    caracteristicas: [],
    caracteristicasPersonalizadas: [],
    imagenes: [],
    documentos: [],
  });

  // Estados para las opciones de los dropdowns
  const [tipoInmuebles, setTipoInmuebles] = useState([]);
  const [estadoInmuebles, setEstadoInmuebles] = useState([]);
  const [asesores, setAsesores] = useState([]);
  const [propietariosPersona, setPropietariosPersona] = useState([]);
  const [propietariosEmpresa, setPropietariosEmpresa] = useState([]);
  const [estados, setEstados] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [zonas, setZonas] = useState([]);
  const [tipoNegocios, setTipoNegocios] = useState([]);
  const [caracteristicas, setCaracteristicas] = useState([]);
  const [caracteristicaSearch, setCaracteristicaSearch] = useState('');
  const [filteredCaracteristicas, setFilteredCaracteristicas] = useState([]);

  // Loading and error states for options fetching
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [errorOptions, setErrorOptions] = useState(null);

  // Mapping of estadoId to coordinates [lat, lng]
  const estadoCoordinatesMap = {
    // Example coordinates, replace with accurate ones as needed
    '1': [3.4168, -67.8663],   // Amazonas
    '2': [10.1333, -64.6833],  // Anzoátegui
    '3': [7.55, -69.25],       // Apure
    '4': [10.2333, -67.6],     // Aragua
    '5': [8.6, -70.2167],      // Barinas
    '6': [8.3, -62.75],        // Bolívar
    '7': [10.2, -68],          // Carabobo
    '8': [9.65, -68.35],       // Cojedes
    '9': [8.3, -61.5],         // Delta Amacuro
    '10': [11.4, -69.6667],    // Falcón
    '11': [9.0, -66.5],        // Guárico
    '12': [10.0667, -69.3333], // Lara
    '13': [8.6, -71.15],       // Mérida
    '14': [10.2333, -66.75],   // Miranda
    '15': [9.55, -63.15],      // Monagas
    '16': [10.9667, -63.85],   // Nueva Esparta
    '17': [9.05, -69.25],      // Portuguesa
    '18': [10.5, -63.25],      // Sucre
    '19': [7.9, -72.25],       // Táchira
    '20': [9.3333, -70.8],     // Trujillo
    '21': [10.6, -66.95],      // Vargas
    '22': [10.2, -68.3667],    // Yaracuy
    '23': [10.65, -71.65],     // Zulia
    '24': [10.5, -66.9167],    // Distrito Capital
  };

  // Update map coordinates when estadoId changes
  useEffect(() => {
    if (formData.estadoId && estadoCoordinatesMap[formData.estadoId]) {
      const [lat, lng] = estadoCoordinatesMap[formData.estadoId];
      setFormData(prev => ({
        ...prev,
        coordenadas: `${lat}, ${lng}`
      }));
    }
  }, [formData.estadoId]);

  // ==============================================
  // EFECTOS SECUNDARIOS (useEffect)
  // ==============================================

  // Cargar datos iniciales 
  useEffect(() => {
    const fetchOptions = async () => {
      setLoadingOptions(true);
      setErrorOptions(null);
      try {
        const [
          tipoInmueblesRes,
          estadoInmueblesRes,
          asesoresRes,
          propietariosPersonaRes,
          propietariosEmpresaRes,
          estadosRes,
          tipoNegociosRes,
          caracteristicasRes
        ] = await Promise.all([
          fetch('/api/inmueble/tipos'),
          fetch('/api/inmueble/estados'),
          fetch('/api/inmueble/asesores'),
          fetch('/api/inmueble/propietarios/persona'),
          fetch('/api/inmueble/propietarios/empresa'),
          fetch('/api/inmueble/ubicacion/estados'),
          fetch('/api/inmueble/tiponegocios'),
          fetch('/api/inmueble/caracteristicas')
        ]);

        if (!tipoInmueblesRes.ok) throw new Error('Failed to fetch tipoInmuebles');
        if (!estadoInmueblesRes.ok) throw new Error('Failed to fetch estadoInmuebles');
        if (!asesoresRes.ok) throw new Error('Failed to fetch asesores');
        if (!propietariosPersonaRes.ok) throw new Error('Failed to fetch propietarios persona');
        if (!propietariosEmpresaRes.ok) throw new Error('Failed to fetch propietarios empresa');
        if (!estadosRes.ok) throw new Error('Failed to fetch estados');
        if (!tipoNegociosRes.ok) throw new Error('Failed to fetch tipoNegocios');
        if (!caracteristicasRes.ok) throw new Error('Failed to fetch caracteristicas');

        setTipoInmuebles(await tipoInmueblesRes.json());
        setEstadoInmuebles(await estadoInmueblesRes.json());
        setAsesores(await asesoresRes.json());
        setPropietariosPersona(await propietariosPersonaRes.json());
        setPropietariosEmpresa(await propietariosEmpresaRes.json());
        setEstados(await estadosRes.json());
        setTipoNegocios(await tipoNegociosRes.json());
        setCaracteristicas(await caracteristicasRes.json());
      } catch (error) {
        setErrorOptions(error.message);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // Filtrar ciudades cuando se selecciona estado
  useEffect(() => {
    const fetchCiudades = async () => {
      if (!formData.estadoId) {
        setCiudades([]);
        setFormData(prev => ({ ...prev, ciudadId: '', zonaId: '' }));
        return;
      }
      try {
        const res = await fetch(`/api/inmueble/ubicacion/ciudades/${formData.estadoId}`);
        if (!res.ok) throw new Error('Failed to fetch ciudades');
        setCiudades(await res.json());
        setFormData(prev => ({ ...prev, ciudadId: '', zonaId: '' }));
      } catch (error) {
        setErrorOptions(error.message);
      }
    };
    fetchCiudades();
  }, [formData.estadoId]);

  // Filtrar zonas cuando se selecciona ciudad
   useEffect(() => {
    const fetchZonas = async () => {
      if (!formData.ciudadId) {
        setZonas([]);
        setFormData(prev => ({ ...prev, zonaId: '' }));
        return;
      }
      try {
        const res = await fetch(`/api/inmueble/ubicacion/zonas/${formData.ciudadId}`);
        if (!res.ok) throw new Error('Failed to fetch zonas');
        setZonas(await res.json());
        setFormData(prev => ({ ...prev, zonaId: '' }));
      } catch (error) {
        setErrorOptions(error.message);
      }
    };
    fetchZonas();
  }, [formData.ciudadId]);
  
  // Filtrar características según búsqueda
  useEffect(() => {
    if (caracteristicaSearch) {
      setFilteredCaracteristicas(
        caracteristicas.filter(carac =>
          carac.nombre.toLowerCase().includes(caracteristicaSearch.toLowerCase())
        )
      );
    } else {
      setFilteredCaracteristicas(caracteristicas);
    }
  }, [caracteristicaSearch, caracteristicas]);

  // ==============================================
  // MANEJADORES DE EVENTOS
  // ==============================================

  /**
   * Maneja cambios en los inputs del formulario principal
   * @param {Object} e - Evento del input
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * Maneja cambios en los inputs del formulario de nuevo propietario
   * @param {Object} e - Evento del input
   */
  const handleNewPropietarioChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPropietario((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  /**
   * Maneja el cambio de tipo de propietario (persona/empresa)
   * @param {Object} e - Evento del input
   */
  const handlePropietarioTipoChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      propietarioTipo: e.target.value,
      propietarioId: '',
    }));
  };

  /**
   * Guarda un nuevo propietario en el estado correspondiente
   */
  const handleSaveNewPropietario = () => {
    // Simular guardado en API
    const newId = Math.max(...propietariosPersona.map(p => p.id), 0) + 1;
    
    if (newPropietario.tipo === 'persona') {
      const newProp = {
        id: newId,
        nombre: `${newPropietario.nombre} ${newPropietario.apellido}`,
        documento: newPropietario.documento,
        telefono: newPropietario.telefono,
        correo: newPropietario.correo
      };
      
      setPropietariosPersona([...propietariosPersona, newProp]);
      setFormData(prev => ({
        ...prev,
        propietarioId: newId.toString()
      }));
    } else {
      const newProp = {
        id: newId,
        nombre: newPropietario.empresaNombre,
        rif: newPropietario.rif,
        representante: newPropietario.representanteLegal
      };
      
      setPropietariosEmpresa([...propietariosEmpresa, newProp]);
      setFormData(prev => ({
        ...prev,
        propietarioId: newId.toString()
      }));
    }
    
    setShowPropietarioForm(false);
    setNewPropietario({
      tipo: 'persona',
      nombre: '',
      apellido: '',
      documento: '',
      telefono: '',
      correo: '',
      direccion: '',
      empresaNombre: '',
      rif: '',
      representanteLegal: ''
    });
    
    toastRef.current?.addToast('Propietario registrado correctamente', 'success', 3000);
  };

  /**
   * Maneja cambios en las imágenes del inmueble
   * @param {Array} images - Lista de imágenes actualizada
   */
  const handleImagesChange = (images) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: images,
    }));
  };

  /**
   * Maneja cambios en los documentos del inmueble
   * @param {Array} documents - Lista de documentos actualizada
   */
  const handleDocumentsChange = (documents) => {
    setFormData((prev) => ({
      ...prev,
      documentos: documents,
    }));
  };

  /**
   * Agrega una nueva característica personalizada
   */
  const handleAddCustomCharacteristic = () => {
    const newCharacteristic = {
      id: Date.now(), // ID temporal
      nombre: `Característica personalizada ${formData.caracteristicasPersonalizadas.length + 1}`,
      valor: '',
      personalizada: true
    };
    
    setFormData(prev => ({
      ...prev,
      caracteristicasPersonalizadas: [...prev.caracteristicasPersonalizadas, newCharacteristic]
    }));
  };

  /**
   * Maneja cambios en una característica personalizada
   * @param {Number} id - ID de la característica
   * @param {String} field - Campo a modificar
   * @param {String} value - Nuevo valor
   */
  const handleCustomCharacteristicChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      caracteristicasPersonalizadas: prev.caracteristicasPersonalizadas.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  /**
   * Elimina una característica personalizada
   * @param {Number} id - ID de la característica a eliminar
   */
  const handleRemoveCustomCharacteristic = (id) => {
    setFormData(prev => ({
      ...prev,
      caracteristicasPersonalizadas: prev.caracteristicasPersonalizadas.filter(c => c.id !== id)
    }));
  };

  /**
   * Maneja el envío del formulario
   * @param {Object} e - Evento del formulario
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.codigo || !formData.titulo || !formData.tipoInmuebleId || !formData.asesorId || !formData.propietarioId) {
      toastRef.current?.addToast('Por favor complete los campos obligatorios marcados con *', 'error', 5000);
      return;
    }
    if (!formData.zonaId || !formData.direccionExacta) {
      toastRef.current?.addToast('Por favor complete la información de ubicación', 'error', 5000);
      return;
    }
    
    // Validar al menos un tipo de negocio
    if (formData.tipoNegocios.length === 0) {
      toastRef.current?.addToast('Seleccione al menos un tipo de negocio', 'error', 5000);
      return;
    }
    
    // Validar precios en tipos de negocio
    const hasInvalidPrices = formData.tipoNegocios.some(tn => !tn.precio || isNaN(tn.precio) || tn.precio <= 0);
    if (hasInvalidPrices) {
      toastRef.current?.addToast('Ingrese precios válidos para los tipos de negocio seleccionados', 'error', 5000);
      return;
    }
    
    try {
      const response = await fetch('/api/inmueble', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el inmueble');
      }
      toastRef.current?.addToast('Inmueble creado correctamente', 'success', 5000);
      // Optionally reset form here
    } catch (error) {
      toastRef.current?.addToast(error.message, 'error', 5000);
    }
  };

  // ==============================================
  // RENDERIZADO DEL COMPONENTE
  // ==============================================

  return (
    <PageTemplate 
      pageClass="crear-inmueble-layout" 
      contentClass="crear-inmueble-content" 
      title="Crear Inmueble"
    >
      <form onSubmit={handleSubmit} className="crear-inmueble-form">
        {/* Encabezado con pestañas y botón de guardar */}
        <div className="form-header">
          <div className="form-tabs">
            <button 
              type="button"
              className={activeTab === 'basica' ? 'active' : ''} 
              onClick={() => setActiveTab('basica')}
            >
              Información Básica
            </button>
            <button 
              type="button"
              className={activeTab === 'fisica' ? 'active' : ''} 
              onClick={() => setActiveTab('fisica')}
            >
              Atributos Físicos
            </button>
            <button 
              type="button"
              className={activeTab === 'ubicacion' ? 'active' : ''} 
              onClick={() => setActiveTab('ubicacion')}
            >
              Ubicación
            </button>
            <button 
              type="button"
              className={activeTab === 'negocios' ? 'active' : ''} 
              onClick={() => setActiveTab('negocios')}
            >
              Negocios
            </button>
            <button 
              type="button"
              className={activeTab === 'caracteristicas' ? 'active' : ''} 
              onClick={() => setActiveTab('caracteristicas')}
            >
              Características
            </button>
            <button 
              type="button"
              className={activeTab === 'multimedia' ? 'active' : ''} 
              onClick={() => {
                setActiveTab('multimedia');
                setActiveMultimediaTab('imagenes');
              }}
            >
              Multimedia
            </button>
          </div>
          
          <button type="submit" className="btn-primary">
            Guardar Inmueble
          </button>
        </div>

        {/* SECCIÓN: Información Básica */}
        {activeTab === 'basica' && (
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
                      <option key={tipo.id} value={tipo.id}>{tipo.nombre}</option>
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
                  >
                    <option value="">Seleccione...</option>
                    {asesores.map((asesor) => (
                      <option key={asesor.id} value={asesor.id}>{asesor.nombre}</option>
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
                    <button 
                      type="button" 
                      className="btn-add"
                      onClick={() => setShowPropietarioForm(true)}
                    >
                      + Registrar Nuevo
                    </button>
                  </div>
                  
                  {formData.propietarioTipo === 'persona' ? (
                    <select 
                      name="propietarioId" 
                      value={formData.propietarioId} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Seleccione Persona</option>
                      {propietariosPersona.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nombre} ({p.documento})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <select 
                      name="propietarioId" 
                      value={formData.propietarioId} 
                      onChange={handleChange} 
                      required
                    >
                      <option value="">Seleccione Empresa</option>
                      {propietariosEmpresa.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nombre} ({e.rif})
                        </option>
                      ))}
                    </select>
                  )}
                </fieldset>
              </div>
            </div>
          </section>
        )}

        {/* SECCIÓN: Atributos Físicos */}
        {activeTab === 'fisica' && (
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
        )}

        {/* SECCIÓN: Ubicación */}
        {activeTab === 'ubicacion' && (
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
        )}

        {/* SECCIÓN: Tipos de Negocio */}
        {activeTab === 'negocios' && (
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
        )}

        {/* SECCIÓN: Características */}
        {activeTab === 'caracteristicas' && (
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
        )}

        {/* SECCIÓN: Multimedia */}
        {activeTab === 'multimedia' && (
          <section className="form-section">
            <h2>Multimedia</h2>
            
            <div className="multimedia-tabs">
              <button 
                type="button"
                className={activeMultimediaTab === 'imagenes' ? 'active' : ''}
                onClick={() => setActiveMultimediaTab('imagenes')}
              >
                Imágenes
              </button>
              <button 
                type="button"
                className={activeMultimediaTab === 'documentos' ? 'active' : ''}
                onClick={() => setActiveMultimediaTab('documentos')}
              >
                Documentos
              </button>
            </div>
            
            <div className="multimedia-content">
              {activeMultimediaTab === 'imagenes' ? (
                <>
                  <h3>Imágenes del Inmueble</h3>
                  <p>Suba imágenes de alta calidad que muestren el inmueble. La primera imagen será la portada.</p>
                  <ImageGallery 
                    images={formData.imagenes} 
                    onChange={handleImagesChange} 
                    mode="edit" 
                  />
                </>
              ) : (
                <>
                  <h3>Documentos Legales</h3>
                  <p>Suba documentos relacionados con el inmueble (escrituras, permisos, etc.)</p>
                  <DocumentList 
                    documents={formData.documentos} 
                    onChange={handleDocumentsChange} 
                    mode="edit" 
                    containerHeight="400px" 
                  />
                </>
              )}
            </div>
          </section>
        )}
      </form>

      {/* Modal para nuevo propietario */}
      {showPropietarioForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Registrar Nuevo Propietario</h2>
            
            <div className="modal-tabs">
              <button 
                type="button"
                className={newPropietario.tipo === 'persona' ? 'active' : ''}
                onClick={() => setNewPropietario({...newPropietario, tipo: 'persona'})}
              >
                Persona
              </button>
              <button 
                type="button"
                className={newPropietario.tipo === 'empresa' ? 'active' : ''}
                onClick={() => setNewPropietario({...newPropietario, tipo: 'empresa'})}
              >
                Empresa
              </button>
            </div>
            
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
              </div>
            )}
            
            <div className="modal-actions">
              <button 
                type="button" 
                className="btn-secondary"
                onClick={() => setShowPropietarioForm(false)}
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
      )}

      <ToastContainer ref={toastRef} />
    </PageTemplate>
  );
};

export default CrearInmueble;