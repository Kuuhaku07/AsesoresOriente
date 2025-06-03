import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageTemplate from '../components/PageTemplate';
import ToastContainer from '../components/ToastContainer';

import BasicInfoSection from '../components/CrearInmuebleSections/BasicInfoSection';
import PhysicalAttributesSection from '../components/CrearInmuebleSections/PhysicalAttributesSection';
import LocationSection from '../components/CrearInmuebleSections/LocationSection';
import BusinessTypesSection from '../components/CrearInmuebleSections/BusinessTypesSection';
import CharacteristicsSection from '../components/CrearInmuebleSections/CharacteristicsSection';
import MultimediaSection from '../components/CrearInmuebleSections/MultimediaSection';
import NuevoPropietarioModal from '../components/CrearInmuebleSections/NuevoPropietarioModal';
import '../styles/Register.css';
import '../styles/CrearInmueble.css';

import { formatDateForInput } from '../utils/dateUtils'; 
import { validateData } from '../utils/validationUtils';
import LoadingSpinner from '../components/LoadingSpinner';

const ModificarInmueble = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const toastRef = useRef(null);
  
  // Estados para pestañas
  const [activeTab, setActiveTab] = useState('basica');
  const [activeMultimediaTab, setActiveMultimediaTab] = useState('imagenes');
  
  // Estados para propietario
  const [showPropietarioForm, setShowPropietarioForm] = useState(false);
  const [selectedPropietario, setSelectedPropietario] = useState(null);
  const [isEditingPropietario, setIsEditingPropietario] = useState(false);
  
  // Estados para carga y envío
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

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
    representanteLegal: '',
    fechaNacimiento: '',
    estadoCivilId: '',
    notas: ''
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
  });

  // Estados para documentos
  const [documentosInmueble, setDocumentosInmueble] = useState([]);
  const [documentosPropietario, setDocumentosPropietario] = useState([]);

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
  const [estadoCivilOptions, setEstadoCivilOptions] = useState([]);
  const [tiposDocumento, setTiposDocumento] = useState([]);

  // Cargar datos iniciales del inmueble
  useEffect(() => {
    const fetchInmuebleData = async () => {
        try {
        setLoading(true);
        
        // 1. Primero cargar todos los datos básicos
        const [dataResponse, estadosResponse] = await Promise.all([
            fetch(`/api/inmueble/modificar/${id}`),
            fetch('/api/inmueble/ubicacion/estados')
        ]);
        
        if (!dataResponse.ok) throw new Error('Error al cargar datos del inmueble');
        if (!estadosResponse.ok) throw new Error('Error al cargar estados');
        
        const data = await dataResponse.json();
        const estadosData = await estadosResponse.json();
        
        // Establecer datos básicos
        setTipoInmuebles(data.tipoInmuebles);
        setEstadoInmuebles(data.estadoInmuebles);
        setAsesores(data.asesores);
        setPropietariosPersona(data.propietariosPersona);
        setPropietariosEmpresa(data.propietariosEmpresa);
        setEstados(estadosData);
        setTipoNegocios(data.tipoNegocios);
        setCaracteristicas(data.caracteristicas);
        setEstadoCivilOptions(data.estadoCivil);
        setTiposDocumento(data.tiposDocumento);
        
        // Si hay datos del inmueble
        if (data.inmuebleData) {
            const inmueble = data.inmuebleData;
            
            // Obtener ciudad y estado basado en zonaId (si existe)
            let ciudadId = '';
            let estadoId = '';
            let zonasData = [];

            if (inmueble.zona_id) {
            try {
                const zonaResponse = await fetch(`/api/inmueble/ubicacion/zonas/${inmueble.zona_id}`);
                if (zonaResponse.ok) {
                const zonaData = await zonaResponse.json();
                ciudadId = zonaData.ciudad_id;
                
                // Cargar todas las zonas para esta ciudad
                if (ciudadId) {
                    const zonasResponse = await fetch(`/api/inmueble/ubicacion/zonas/${ciudadId}`);
                    if (zonasResponse.ok) {
                    zonasData = await zonasResponse.json();
                    }
                }
                }
            } catch (error) {
                console.error('Error cargando zona:', error);
            }

            }
            
            setFormData({
                codigo: inmueble.codigo,
                titulo: inmueble.titulo,
                descripcion: inmueble.descripcion,
                tipoInmuebleId: inmueble.tipo_inmueble_id?.toString() || '',
                estadoInmuebleId: inmueble.estado_id?.toString() || '',
                asesorId: inmueble.asesor_id?.toString() || '',
                propietarioTipo: inmueble.propietarioTipo || 'persona',
                propietarioId: inmueble.propietario_persona_id 
                    ? inmueble.propietario_persona_id.toString() 
                    : inmueble.propietario_empresa_id?.toString() || '',
                areaConstruida: inmueble.area_construida?.toString() || '',
                areaTerreno: inmueble.area_terreno?.toString() || '',
                habitaciones: inmueble.habitaciones || 0,
                banos: inmueble.banos || 0,
                estacionamientos: inmueble.estacionamientos || 0,
                niveles: inmueble.niveles || 1,
                anoConstruccion: inmueble.ano_construccion?.toString() || '',
                amueblado: inmueble.amueblado || false,
                climatizado: inmueble.climatizado || false,
                estadoId: estadoId ? estadoId.toString() : '',
                ciudadId: ciudadId ? ciudadId.toString() : '',
                zonaId: inmueble.zona_id ? inmueble.zona_id.toString() : '',
                direccionExacta: inmueble.direccion_exacta || '',
                referencia: inmueble.referencia || '',
                coordenadas: inmueble.coordenadas || '',
                tipoNegocios: inmueble.tipoNegocios || [],
                caracteristicas: inmueble.caracteristicas || [],
                caracteristicasPersonalizadas: inmueble.caracteristicasPersonalizadas || [],
                imagenes: inmueble.imagenes || [],
                });

            setCiudades(estadosData.filter(e => e.estado_id === estadoId));
            setZonas(zonasData);
            setDocumentosInmueble(inmueble.documentos || []);

            if (inmueble.propietario) {
            const prop = inmueble.propietario;
            const propietarioObj = {
                id: prop.id,
                label: inmueble.propietarioTipo === 'persona' 
                ? `${prop.nombre} ${prop.apellido || ''} (${prop.documento_identidad || ''})`
                : `${prop.nombre} (${prop.rif || ''})`,
                ...prop
            };
            setSelectedPropietario(propietarioObj);
            }
        }
        
        setInitialLoadComplete(true);
        } catch (error) {
        console.error('Error en fetchInmuebleData:', error);
        toastRef.current?.addToast(error.message, 'error', 5000);
        } finally {
        setLoading(false);
        }
    };

    fetchInmuebleData();
    }, [id]);

   // Agrega esto temporalmente para ver qué está recibiendo
    useEffect(() => {
    if (initialLoadComplete) {
        console.log("Datos cargados:", {
        formData,
        ciudades,
        zonas,
        documentosInmueble,
        selectedPropietario
        });
    }
    }, [initialLoadComplete]); 
  // Filtrar ciudades cuando se selecciona estado
  useEffect(() => {
    const fetchCiudades = async () => {
      if (!formData.estadoId) {
        setCiudades([]);
        return;
      }
      try {
        const res = await fetch(`/api/inmueble/ubicacion/ciudades/${formData.estadoId}`);
        if (!res.ok) throw new Error('Failed to fetch ciudades');
        setCiudades(await res.json());
      } catch (error) {
        toastRef.current?.addToast(error.message, 'error', 5000);
      }
    };
    fetchCiudades();
  }, [formData.estadoId]);

  // Filtrar zonas cuando se selecciona ciudad
  useEffect(() => {
  const fetchZonas = async () => {
    if (!formData.ciudadId || isNaN(formData.ciudadId)) {
      setZonas([]);
      return;
    }
    
    try {
      const res = await fetch(`/api/inmueble/ubicacion/zonas/${formData.ciudadId}`);
      if (!res.ok) throw new Error('Failed to fetch zonas');
      const zonasData = await res.json();
      setZonas(zonasData);
      
      // Si hay una zonaId en formData pero no está en las zonas cargadas, limpiarla
      if (formData.zonaId && !zonasData.some(z => z.id.toString() === formData.zonaId)) {
        setFormData(prev => ({ ...prev, zonaId: '' }));
      }
    } catch (error) {
      console.error('Error fetching zonas:', error);
      toastRef.current?.addToast('Error cargando zonas', 'error', 5000);
      setZonas([]);
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

  // Manejadores de eventos (los mismos que en CrearInmueble)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleNewPropietarioChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNewPropietario((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handlePropietarioTipoChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      propietarioTipo: e.target.value,
      propietarioId: '',
    }));
    setSelectedPropietario(null);
  };

  const handlePropietarioInputChange = (inputValue) => {
    setSelectedPropietario(null);
    setFormData(prev => ({ ...prev, propietarioId: '' }));
  };

  const handleSelectPropietario = (propietario) => {
    setSelectedPropietario(propietario);
    setFormData(prev => ({ ...prev, propietarioId: propietario.id.toString() }));
  };

  const fetchPropietarios = async (searchTerm) => {
    const tipo = formData.propietarioTipo;
    let data = [];
    const lowerSearchTerm = searchTerm.toLowerCase();
    
    if (tipo === 'persona') {
      data = propietariosPersona.filter(p => {
        const fullName = (p.nombre + ' ' + (p.apellido || '')).toLowerCase();
        const documento = p.documento ? p.documento.toLowerCase() : '';
        return fullName.includes(lowerSearchTerm) || documento.includes(lowerSearchTerm);
      });
      return data.map(p => ({
        id: p.id,
        label: `${p.nombre} ${p.apellido || ''} (${p.documento || ''})`,
        ...p
      }));
    } else if (tipo === 'empresa') {
      data = propietariosEmpresa.filter(e => {
        const nombre = e.nombre.toLowerCase();
        const rif = e.rif ? e.rif.toLowerCase() : '';
        return nombre.includes(lowerSearchTerm) || rif.includes(lowerSearchTerm);
      });
      return data.map(e => ({
        id: e.id,
        label: `${e.nombre} (${e.rif || ''})`,
        ...e
      }));
    }
    return [];
  };

  const handleEditPropietarioClick = () => {
    if (!selectedPropietario) return;
    
    setIsEditingPropietario(true);
    setShowPropietarioForm(true);

    if (formData.propietarioTipo === 'persona') {
      setNewPropietario({
        tipo: 'persona',
        nombre: selectedPropietario.nombre || '',
        apellido: selectedPropietario.apellido || '',
        documento: selectedPropietario.documento_identidad || '',
        telefono: selectedPropietario.telefono || '',
        correo: selectedPropietario.correo || '',
        direccion: selectedPropietario.direccion || '',
        empresaNombre: '',
        rif: '',
        representanteLegal: '',
        fechaNacimiento: selectedPropietario.fecha_nacimiento ? formatDateForInput(selectedPropietario.fecha_nacimiento) : '',
        estadoCivilId: selectedPropietario.estado_civil_id ? selectedPropietario.estado_civil_id : '',
        notas: selectedPropietario.notas || ''
      });
    } else {
      setNewPropietario({
        tipo: 'empresa',
        nombre: '',
        apellido: '',
        documento: '',
        telefono: selectedPropietario.telefono || '',
        correo: selectedPropietario.correo || '',
        direccion: selectedPropietario.direccion || '',
        empresaNombre: selectedPropietario.nombre || '',
        rif: selectedPropietario.rif || '',
        representanteLegal: selectedPropietario.representante_legal || '',
        notas: selectedPropietario.notas || ''
      });
    }
  };

  const handleSaveNewPropietario = async () => {
    try {
      if (isEditingPropietario && selectedPropietario) {
        // Actualizar propietario existente
        const url = formData.propietarioTipo === 'persona' 
          ? `/api/inmueble/propietarios/persona/${selectedPropietario.id}`
          : `/api/inmueble/propietarios/empresa/${selectedPropietario.id}`;
        
        const method = 'PUT';
        const body = formData.propietarioTipo === 'persona' 
          ? {
              nombre: newPropietario.nombre,
              apellido: newPropietario.apellido,
              documento: newPropietario.documento,
              telefono: newPropietario.telefono,
              correo: newPropietario.correo,
              direccion: newPropietario.direccion,
              fechaNacimiento: newPropietario.fechaNacimiento,
              estadoCivilId: newPropietario.estadoCivilId,
              notas: newPropietario.notas
            }
          : {
              empresaNombre: newPropietario.empresaNombre,
              rif: newPropietario.rif,
              representanteLegal: newPropietario.representanteLegal,
              telefono: newPropietario.telefono,
              correo: newPropietario.correo,
              direccion: newPropietario.direccion,
              notas: newPropietario.notas
            };

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error('Error al actualizar propietario');
        
        const updatedProp = await response.json();
        
        // Actualizar lista de propietarios
        if (formData.propietarioTipo === 'persona') {
          const updatedList = await fetch('/api/inmueble/propietarios/persona');
          setPropietariosPersona(await updatedList.json());
        } else {
          const updatedList = await fetch('/api/inmueble/propietarios/empresa');
          setPropietariosEmpresa(await updatedList.json());
        }

        // Actualizar propietario seleccionado
        const newLabel = formData.propietarioTipo === 'persona'
          ? `${updatedProp.nombre} ${updatedProp.apellido || ''} (${updatedProp.documento || ''})`
          : `${updatedProp.empresaNombre || updatedProp.nombre} (${updatedProp.rif || ''})`;
        
        setSelectedPropietario({
          ...selectedPropietario,
          ...updatedProp,
          label: newLabel
        });

        toastRef.current?.addToast('Propietario actualizado correctamente', 'success', 3000);
      } else {
        // Crear nuevo propietario
        const url = newPropietario.tipo === 'persona'
          ? '/api/inmueble/propietarios/persona'
          : '/api/inmueble/propietarios/empresa';
        
        const method = 'POST';
        const body = newPropietario.tipo === 'persona'
          ? {
              nombre: newPropietario.nombre,
              apellido: newPropietario.apellido,
              documento: newPropietario.documento,
              telefono: newPropietario.telefono,
              correo: newPropietario.correo,
              direccion: newPropietario.direccion,
              fechaNacimiento: newPropietario.fechaNacimiento,
              estadoCivilId: newPropietario.estadoCivilId
            }
          : {
              empresaNombre: newPropietario.empresaNombre,
              rif: newPropietario.rif,
              representanteLegal: newPropietario.representanteLegal,
              telefono: newPropietario.telefono,
              correo: newPropietario.correo,
              direccion: newPropietario.direccion,
              notas: newPropietario.notas
            };

        const response = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });

        if (!response.ok) throw new Error('Error al crear propietario');
        
        const newProp = await response.json();
        
        // Actualizar lista de propietarios
        if (newPropietario.tipo === 'persona') {
          const updatedList = await fetch('/api/inmueble/propietarios/persona');
          setPropietariosPersona(await updatedList.json());
        } else {
          const updatedList = await fetch('/api/inmueble/propietarios/empresa');
          setPropietariosEmpresa(await updatedList.json());
        }

        // Establecer nuevo propietario como seleccionado
        const newLabel = newPropietario.tipo === 'persona'
          ? `${newProp.nombre} ${newProp.apellido || ''} (${newProp.documento || ''})`
          : `${newProp.empresaNombre || newProp.nombre} (${newProp.rif || ''})`;
        
        setSelectedPropietario({
          id: newProp.id,
          label: newLabel,
          ...newProp
        });

        setFormData(prev => ({
          ...prev,
          propietarioTipo: newPropietario.tipo,
          propietarioId: newProp.id.toString()
        }));

        toastRef.current?.addToast('Propietario creado correctamente', 'success', 3000);
      }

      setShowPropietarioForm(false);
      setIsEditingPropietario(false);
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
        representanteLegal: '',
        fechaNacimiento: '',
        estadoCivilId: '',
        notas: ''
      });
    } catch (error) {
      toastRef.current?.addToast(error.message, 'error', 5000);
    }
  };

  const handleImagesChange = (images) => {
    setFormData((prev) => ({
      ...prev,
      imagenes: images,
    }));
  };

  const handleDocumentsChange = (documents) => {
    setDocumentosInmueble(documents);
  };

  const handleAddCustomCharacteristic = () => {
    const newCharacteristic = {
      id: Date.now(),
      nombre: `Característica personalizada ${formData.caracteristicasPersonalizadas.length + 1}`,
      valor: '',
      personalizada: true
    };
    
    setFormData(prev => ({
      ...prev,
      caracteristicasPersonalizadas: [...prev.caracteristicasPersonalizadas, newCharacteristic]
    }));
  };

  const handleCustomCharacteristicChange = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      caracteristicasPersonalizadas: prev.caracteristicasPersonalizadas.map(c => 
        c.id === id ? { ...c, [field]: value } : c
      )
    }));
  };

  const handleRemoveCustomCharacteristic = (id) => {
    setFormData(prev => ({
      ...prev,
      caracteristicasPersonalizadas: prev.caracteristicasPersonalizadas.filter(c => c.id !== id)
    }));
  };

  // Función para actualizar el inmueble
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación (similar a CrearInmueble)
    const rules = {
      codigo: { required: true },
      titulo: { required: true },
      tipoInmuebleId: { required: true },
      asesorId: { required: true },
      propietarioId: { required: true },
      zonaId: { required: true },
      direccionExacta: { required: true },
    };

    const errors = validateData(formData, rules);

    if (formData.tipoNegocios.length === 0) {
      errors.push('Seleccione al menos un tipo de negocio');
    }
    const hasInvalidPrices = formData.tipoNegocios.some(tn => !tn.precio || isNaN(tn.precio) || tn.precio <= 0);
    if (hasInvalidPrices) {
      errors.push('Ingrese precios válidos para los tipos de negocio seleccionados');
    }

    if (errors.length > 0) {
      errors.forEach(err => {
        toastRef.current?.addToast(err, 'error', 5000);
      });
      return;
    }

    try {
      setSubmitting(true);

      // Preparar datos para enviar
      const inmuebleDataToSend = {
        ...formData,
        documentos: documentosInmueble,
        id: id // Asegurarnos de incluir el ID para la actualización
      };

      const response = await fetch(`/api/inmueble/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inmuebleDataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al actualizar el inmueble');
      }

      toastRef.current?.addToast('Inmueble actualizado correctamente', 'success', 5000);

    } catch (error) {
      toastRef.current?.addToast(error.message, 'error', 5000);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !initialLoadComplete) {
    return (
      <PageTemplate title="Cargando inmueble...">
        <LoadingSpinner />
      </PageTemplate>
    );
  }

  return (
    <PageTemplate 
      pageClass="crear-inmueble-layout" 
      contentClass="crear-inmueble-content" 
      title={`Modificar Inmueble: ${formData.codigo}`}
    >
      {submitting && <LoadingSpinner />}
      <form onSubmit={handleSubmit} className="crear-inmueble-form" style={{ pointerEvents: submitting ? 'none' : 'auto', opacity: submitting ? 0.6 : 1 }}>
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
          
          <button type="submit" className="btn-primary" disabled={submitting}>
            Guardar Cambios
          </button>
        </div>

        {/* SECCIÓN: Información Básica */}
        {activeTab === 'basica' && (
          <BasicInfoSection 
            formData={formData} 
            handleChange={handleChange} 
            tipoInmuebles={tipoInmuebles} 
            estadoInmuebles={estadoInmuebles} 
            asesores={asesores} 
            user={user} 
            handlePropietarioTipoChange={handlePropietarioTipoChange}
            selectedPropietario={selectedPropietario}
            setSelectedPropietario={setSelectedPropietario}
            setShowPropietarioForm={setShowPropietarioForm}
            setIsEditingPropietario={setIsEditingPropietario}
            newPropietario={newPropietario}
            setNewPropietario={setNewPropietario}
            handleEditPropietarioClick={handleEditPropietarioClick}
            handlePropietarioInputChange={handlePropietarioInputChange}
            handleSelectPropietario={handleSelectPropietario}
            fetchPropietarios={fetchPropietarios}
          />
        )}

        {/* SECCIÓN: Atributos Físicos */}
        {activeTab === 'fisica' && (
          <PhysicalAttributesSection 
            formData={formData} 
            handleChange={handleChange} 
          />
        )}

        {/* SECCIÓN: Ubicación */}
        {activeTab === 'ubicacion' && (
          <LocationSection 
            formData={formData} 
            handleChange={handleChange} 
            estados={estados}
            ciudades={ciudades}
            zonas={zonas}
            setFormData={setFormData}
          />
        )}

        {/* SECCIÓN: Tipos de Negocio */}
        {activeTab === 'negocios' && (
          <BusinessTypesSection 
            tipoNegocios={tipoNegocios} 
            formData={formData} 
            setFormData={setFormData} 
          />
        )}

        {/* SECCIÓN: Características */}
        {activeTab === 'caracteristicas' && (
          <CharacteristicsSection 
            formData={formData} 
            setFormData={setFormData} 
            caracteristicaSearch={caracteristicaSearch}
            setCaracteristicaSearch={setCaracteristicaSearch}
            filteredCaracteristicas={filteredCaracteristicas}
            setFilteredCaracteristicas={setFilteredCaracteristicas}
            handleAddCustomCharacteristic={handleAddCustomCharacteristic}
            handleCustomCharacteristicChange={handleCustomCharacteristicChange}
            handleRemoveCustomCharacteristic={handleRemoveCustomCharacteristic}
          />
        )}

        {/* SECCIÓN: Multimedia */}
        {activeTab === 'multimedia' && (
          <MultimediaSection 
            activeMultimediaTab={activeMultimediaTab}
            setActiveMultimediaTab={setActiveMultimediaTab}
            formData={formData}
            handleImagesChange={handleImagesChange}
            tiposDocumento={tiposDocumento}
            documentosInmueble={documentosInmueble}
            documentosPropietario={documentosPropietario}
            setDocumentosInmueble={setDocumentosInmueble}
            setDocumentosPropietario={setDocumentosPropietario}
            toastRef={toastRef}
          />
        )}
      </form>

      <NuevoPropietarioModal
        isOpen={showPropietarioForm}
        onClose={() => setShowPropietarioForm(false)}
        isEditing={isEditingPropietario}
        newPropietario={newPropietario}
        handleNewPropietarioChange={handleNewPropietarioChange}
        handleSaveNewPropietario={handleSaveNewPropietario}
        estadoCivilOptions={estadoCivilOptions}
      />

      <ToastContainer ref={toastRef} />
    </PageTemplate>
  );
};

export default ModificarInmueble;