import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import MangoTemplate from '../components/MangoTemplate';
import PageTitle from '../components/PageTitle';
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
import NotFoundPage from '../components/NotFoundPage';

import { verifyPermissions } from '../utils/permissionUtils';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ModificarInmueble = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  const toastRef = useRef(null);

  // New state for error status
  const [errorStatus, setErrorStatus] = useState(null);
  
  // Estados para pestañas
  const [activeTab, setActiveTab] = useState('basica');
  const [activeMultimediaTab, setActiveMultimediaTab] = useState('imagenes');
  
  // Estados para propietario
  const [showPropietarioForm, setShowPropietarioForm] = useState(false);
  const [selectedPropietario, setSelectedPropietario] = useState(null);
  const [isEditingPropietario, setIsEditingPropietario] = useState(false);
  
  // Estados para carga y envío

  const [submitting, setSubmitting] = useState(false);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // State for tipoCaracteristicasOptions
  const [tipoCaracteristicasOptions, setTipoCaracteristicasOptions] = useState([]);

  // Fetch tipoCaracteristicasOptions from backend
  useEffect(() => {
    const fetchTipoCaracteristicas = async () => {
      try {
        const res = await fetch('/api/inmueble/tipocaracteristicas');
        if (!res.ok) throw new Error('Failed to fetch tipoCaracteristicas');
        const tipos = await res.json();
        setTipoCaracteristicasOptions(tipos);
      } catch (error) {
        console.error('Error fetching tipoCaracteristicas:', error);
      }
    };
    fetchTipoCaracteristicas();
  }, []);

  // Function to fetch updated characteristics list
  const fetchCaracteristicas = async () => {
    try {
      const res = await fetch('/api/inmueble/caracteristicas');
      if (!res.ok) throw new Error('Failed to fetch caracteristicas');
      const data = await res.json();
      setCaracteristicas(data);
    } catch (error) {
      console.error('Error fetching caracteristicas:', error);
    }
  };

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
    imagenes: [],
  });

  // Verificar permisos al cargar la página
  useEffect(() => {
    if (!loading) {
      const allowed = user && (verifyPermissions(user, ['ADMINISTRADOR', 'GERENTE']) || user.id_asesor === formData.asesorId);
      if (!allowed) {
        navigate('/');
      }
    }
  }, [user, navigate, loading, formData]);

  // Estados para documentos
  const [documentosInmueble, setDocumentosInmueble] = useState([]);
  const [documentosPropietario, setDocumentosPropietario] = useState([]);

  // Transformar documentos para vista previa al cargar datos iniciales
  useEffect(() => {
    if (initialLoadComplete) {
      const baseUrldoc = ''; // Ajustar si es necesario
      const transformedDocumentosInmueble = documentosInmueble.map(doc => ({
        ...doc,
        nombre: doc.nombreArchivo || doc.nombre || '',
        tipoId: doc.tipoId || doc.tipo_id || null,
        preview: doc.ruta ? baseUrldoc + doc.ruta : '',
        file: null,
      }));
      const transformedDocumentosPropietario = documentosPropietario.map(doc => ({
        ...doc,
        nombre: doc.nombreArchivo || doc.nombre || '',
        tipoId: doc.tipoId || doc.tipo_id || null,
        preview: doc.ruta ? baseUrldoc + doc.ruta : '',
        file: null,
      }));
      setDocumentosInmueble(transformedDocumentosInmueble);
      setDocumentosPropietario(transformedDocumentosPropietario);
    }
  }, [initialLoadComplete]);

  // Manejador para cambios en documentos
  const handleDocumentsChange = (documents, tipo = 'inmueble') => {
    if (tipo === 'inmueble') {
      setDocumentosInmueble(documents);
    } else if (tipo === 'propietario') {
      setDocumentosPropietario(documents);
    }
  };

  /**
   * Función para subir documentos al backend y obtener las rutas guardadas.
   * @param {Array} documents - Array de objetos de documento con archivo y metadatos.
   * @returns {Array} - Array de objetos con rutas y metadatos para guardar en inmueble.
   */
  const uploadDocumentsToServer = async (documents) => {
    const formData = new FormData();
    documents.forEach((doc) => {
      if (doc.file) {
        formData.append('documents', doc.file);
      }
    });
    try {
      const response = await fetch('/api/inmueble/upload/document', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Error al subir documentos');
      }
      const data = await response.json();
      // Mapear las rutas devueltas con los metadatos originales y marcar como nuevos
      return data.archivos.map((fileInfo, index) => ({
        tipoId: documents[index].tipoId || null,
        nombreArchivo: documents[index].nombre || '',
        ruta: fileInfo.ruta,
        tamano: fileInfo.tamaño || 0,
        subidoPor: user?.id || 'usuario_desconocido',
        isNew: true,
      }));
    } catch (error) {
      toastRef.current?.addToast(error.message, 'error', 5000);
      return [];
    }
  };

  /**
   * Función para subir imágenes al backend y obtener las rutas guardadas.
   * @param {Array} images - Array de objetos de imagen con archivo y metadatos.
   * @returns {Array} - Array de objetos con rutas y metadatos para guardar en inmueble.
   */
  const uploadImagesToServer = async (images) => {
    const formData = new FormData();
    images.forEach((img) => {
      if (img.file) {
        formData.append('images', img.file);
      }
    });
    try {
      const response = await fetch('/api/inmueble/upload/image', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) {
        throw new Error('Error al subir imágenes');
      }
      const data = await response.json();
      // Mapear las rutas devueltas con los metadatos originales
      return data.archivos.map((fileInfo, index) => ({
        ruta: fileInfo.ruta,
        titulo: images[index].titulo || '',
        descripcion: images[index].descripcion || '',
        // Asumir que el usuario está logueado, enviar id o nombre de usuario
        subidoPor: user?.id || 'usuario_desconocido',
      }));
    } catch (error) {
      toastRef.current?.addToast(error.message, 'error', 5000);
      return [];
    }
  };

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
        setErrorStatus(null);
        
        // 1. Primero cargar todos los datos básicos
        const [dataResponse, estadosResponse] = await Promise.all([
            fetch(`/api/inmueble/modificar/${id}`),
            fetch('/api/inmueble/ubicacion/estados')
        ]);
        
        if (!dataResponse.ok) {
          if (dataResponse.status === 404 || dataResponse.status === 500) {
            setErrorStatus(dataResponse.status);
            setLoading(false);
            setInitialLoadComplete(true);
            return;
          }
          throw new Error('Error al cargar datos del inmueble');
        }
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
            let ciudadesData = [];

            if (inmueble.zona_id) {
              try {
                // Obtener zona para extraer ciudad_id y estado_id
                const zonaResponse = await fetch(`/api/inmueble/ubicacion/zona/${inmueble.zona_id}`);
                if (zonaResponse.ok) {
                  const zonaData = await zonaResponse.json();
                  ciudadId = zonaData.ciudad_id;
                  estadoId = zonaData.estado_id;

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
            } else if (inmueble.ciudad_id) {
              ciudadId = inmueble.ciudad_id;
              try {
                // Obtener estado_id desde ciudades por estadoId no es posible, se asume que frontend tiene estados
                // Cargar zonas para ciudad
                const zonasResponse = await fetch(`/api/inmueble/ubicacion/zonas/${ciudadId}`);
                if (zonasResponse.ok) {
                  zonasData = await zonasResponse.json();
                }
              } catch (error) {
                console.error('Error cargando ciudad o zonas:', error);
              }
            }

        // Transform inmueble.imagenes to add preview URLs for ImageGallery
        const baseUrl = ''; // Adjust if needed, e.g. process.env.REACT_APP_API_URL or ''
        const transformedImages = (inmueble.imagenes || []).map(img => ({
          ...img,
          preview: img.ruta ? (baseUrl + img.ruta) : '',
          file: null,
          titulo: img.titulo || '',
          descripcion: img.descripcion || '',
          es_portada: img.es_portada || false,
        }));

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
          tipoNegocios: inmueble.tipoNegocios ? inmueble.tipoNegocios.map(tn => ({
            tipoNegocioId: tn.id,
            precio: tn.precio,
            moneda: tn.moneda,
            disponible: tn.disponible
          })) : [],
          caracteristicas: inmueble.caracteristicas ? inmueble.caracteristicas.map(c => ({
            caracteristicaId: c.id,
            tiene: true,
            cantidad: c.cantidad || null
          })) : [],
          imagenes: transformedImages,
        });

            // Corregir setCiudades para usar ciudadesData o fetch ciudades por estadoId
            if (estadoId) {
              try {
                const ciudadesResponse = await fetch(`/api/inmueble/ubicacion/ciudades/${estadoId}`);
                if (ciudadesResponse.ok) {
                  ciudadesData = await ciudadesResponse.json();
                }
              } catch (error) {
                console.error('Error cargando ciudades:', error);
              }
            }

            setCiudades(ciudadesData);
            setZonas(zonasData);
            // Transformar documentosInmueble para agregar campos necesarios para DocumentList
            const baseUrldoc = ''; // Ajustar si es necesario
            const transformedDocumentosInmueble = (inmueble.documentos || []).map(doc => ({
              ...doc,
              nombre: doc.nombre_archivo || doc.nombre || '',
              tipoId: doc.tipoId || doc.tipo_id || null,
              preview: doc.ruta ? baseUrldoc + doc.ruta : '',
              file: null,
            }));

            // Transformar documentosPropietario para agregar campos necesarios para DocumentList
            const transformedDocumentosPropietario = (inmueble.documentosPropietario || []).map(doc => ({
              ...doc,
              nombre: doc.nombre_archivo || doc.nombre || '',
              tipoId: doc.tipoId || doc.tipo_id || null,
              preview: doc.ruta ? baseUrldoc + doc.ruta : '',
              file: null,
            }));

            setDocumentosInmueble(transformedDocumentosInmueble);
            setDocumentosPropietario(transformedDocumentosPropietario);

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
        setFormData(prev => ({ 
          ...prev, 
          ciudadId: '', 
          zonaId: '' 
        }));
        return;
      }
      
      try {
        const res = await fetch(`/api/inmueble/ubicacion/ciudades/${formData.estadoId}`);
        if (!res.ok) throw new Error('Failed to fetch ciudades');
        
        const ciudadesData = await res.json();
        setCiudades(ciudadesData);
        
        // Si la ciudad actual no pertenece al nuevo estado, limpiarla
        if (formData.ciudadId && !ciudadesData.some(c => c.id.toString() === formData.ciudadId)) {
          setFormData(prev => ({ 
            ...prev, 
            ciudadId: '', 
            zonaId: '' 
          }));
        }
      } catch (error) {
        toastRef.current?.addToast(error.message, 'error', 5000);
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
        
        const zonasData = await res.json();
        setZonas(zonasData);
        
        // Si la zona actual no pertenece a la nueva ciudad, limpiarla
        if (formData.zonaId && !zonasData.some(z => z.id.toString() === formData.zonaId)) {
          setFormData(prev => ({ ...prev, zonaId: '' }));
        }
      } catch (error) {
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

  // Function to refresh characteristics list from backend
  const refreshCaracteristicas = async () => {
    try {
      const res = await fetch('/api/inmueble/caracteristicas');
      if (!res.ok) throw new Error('Failed to fetch caracteristicas');
      const data = await res.json();
      setCaracteristicas(data);
    } catch (error) {
      console.error('Error refreshing caracteristicas:', error);
    }
  };

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

      // Subir imágenes nuevas y obtener rutas
      const newImages = formData.imagenes.filter(img => img.file);
      let uploadedImages = [];
      if (newImages.length > 0) {
        uploadedImages = await uploadImagesToServer(newImages);
      }

      // Combinar imágenes existentes (sin file) y las subidas
      const existingImages = formData.imagenes.filter(img => !img.file);
      const combinedImages = [...existingImages, ...uploadedImages];

      // Filtrar documentos nuevos (con file) para subir
      const newDocumentsInmueble = documentosInmueble.filter(doc => doc.file);
      const newDocumentsPropietario = documentosPropietario.filter(doc => doc.file);

      // Subir documentos nuevos y obtener rutas solo si hay documentos nuevos
      let uploadedDocumentsInmueble = [];
      if (newDocumentsInmueble.length > 0) {
        uploadedDocumentsInmueble = await uploadDocumentsToServer(newDocumentsInmueble);
      }
      let uploadedDocumentsPropietario = [];
      if (newDocumentsPropietario.length > 0) {
        uploadedDocumentsPropietario = await uploadDocumentsToServer(newDocumentsPropietario);
      }

      // Filtrar documentos existentes (sin file)
      const existingDocumentsInmueble = documentosInmueble.filter(doc => !doc.file);
      const existingDocumentsPropietario = documentosPropietario.filter(doc => !doc.file);

      // Combinar documentos existentes y subidos
      const combinedDocumentsInmueble = [...existingDocumentsInmueble, ...uploadedDocumentsInmueble];
      const combinedDocumentsPropietario = [...existingDocumentsPropietario, ...uploadedDocumentsPropietario];

      // Combinar ambos tipos de documentos
      const allDocuments = [...combinedDocumentsInmueble, ...combinedDocumentsPropietario];

      // Preparar datos para enviar
      // Asegurar que subidoPor esté definido para imágenes y documentos
      const imagesWithUploader = combinedImages.map(img => ({
        ...img,
        subidoPor: img.subidoPor || user?.id || 'usuario_desconocido'
      }));
      const documentsWithUploader = allDocuments.map(doc => ({
        ...doc,
        nombreArchivo: doc.nombreArchivo || doc.nombre || 'documento_sin_nombre',
        subidoPor: doc.subidoPor || user?.id || 'usuario_desconocido'
      }));

      const inmuebleDataToSend = {
        ...formData,
        imagenes: imagesWithUploader,
        documentos: documentsWithUploader,
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
      <MangoTemplate>
        <PageTitle>Cargando inmueble...</PageTitle>
        <LoadingSpinner />
      </MangoTemplate>
    );
  }

  if (errorStatus === 404 || errorStatus === 500) {
    return (
      <MangoTemplate>
        <PageTitle>Error</PageTitle>
        <NotFoundPage message="Inmueble no encontrado" />
      </MangoTemplate>
    );
  }

  return (
    <MangoTemplate>
      <PageTitle>{`Modificar Inmueble: ${formData.codigo}`}</PageTitle>
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
        refreshCaracteristicas={refreshCaracteristicas}
        handleAddCustomCharacteristic={handleAddCustomCharacteristic}
        handleCustomCharacteristicChange={handleCustomCharacteristicChange}
        handleRemoveCustomCharacteristic={handleRemoveCustomCharacteristic}
        tipoCaracteristicasOptions={tipoCaracteristicasOptions}
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
          handleDocumentsChange={handleDocumentsChange}
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
    </MangoTemplate>
  );
};

export default ModificarInmueble;