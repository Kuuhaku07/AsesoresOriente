import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import MangoTemplate from '../components/MangoTemplate';
import ToastContainer from '../components/ToastContainer';
import FloatingContactButton from '../components/FloatingContactButton';
import CopyButton from '../components/CopyButton';
import { FaWhatsapp, FaCommentDots } from 'react-icons/fa';
import ImageGallery from '../components/ImageGallery';
import DocumentList from '../components/DocumentList';
import Map from '../components/Map';
import LoadingSpinner from '../components/LoadingSpinner';


const Devroom = () => {
  const toastRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();


  // Sample images state for testing ImageGallery
  const [images, setImages] = useState([
    { file: null, preview: 'https://m.media-amazon.com/images/M/MV5BYTI3ZGM1MGUtM2NiOC00ODNlLWE2ZTQtZWMwYWJiMGI0MTJhXkEyXkFqcGc@._V1_.jpg', es_portada: true, titulo: 'Imagen 1', descripcion: 'Descripción 1' },
    { file: null, preview: 'https://m.media-amazon.com/images/M/MV5BNTE1ZWRhOTItZWQwZS00NzY1LTgxMzQtM2I3MTBiYjIyMWQ2XkEyXkFqcGc@._V1_QL75_UX190_CR0,0,190,190_.jpg', es_portada: false, titulo: 'Imagen 2', descripcion: 'Descripción 2' },
   ]);

  const [tiposDocumento, setTiposDocumento] = useState([]);

  useEffect(() => {
    const fetchTiposDocumento = async () => {
      try {
        const response = await fetch('/api/inmueble/tiposdocumento');
        if (!response.ok) throw new Error('Failed to fetch tiposDocumento');
        const tipos = await response.json();
        setTiposDocumento(tipos);
      } catch (error) {
        console.error('Error fetching tiposDocumento:', error);
      }
    };
    fetchTiposDocumento();
  }, []);
  const [documentosInmueble, setDocumentosInmueble] = useState([
  ]);
  const [documentosPropietario, setDocumentosPropietario] = useState([  
  ]);
  const [documents, setDocuments] = useState([
    { file: null, nombre: 'Documento 1.pdf' },
    { file: null, nombre: 'Documento 2.docx' },
  ]);

  const [loading, setLoading] = useState(false);

  const showToast = (message, type) => {
    if (toastRef.current) {
      toastRef.current.addToast(message, type, 5000);
    }
  };

  const contacts = [
    {
      icon: <FaWhatsapp />,
      color: '#25D366',
      link: 'https://wa.me/1234567890',
      action: 'link',
    },
    {
      icon: <FaCommentDots />,
      color: '#FF0000',
      link: 'chat_identifier',
      action: 'copy',
    },
  ];
  
  useEffect(() => {
    const handleClickToDisable = (e) => {
      setLoading(false);
      window.removeEventListener('click', handleClickToDisable);
    };
    if (loading) {
      window.addEventListener('click', handleClickToDisable);
    }

  }, [loading]);

  return (
    <MangoTemplate 

    >
      <p>Lalalalava chichichichicken.</p>
      {loading && <LoadingSpinner />}
      <ToastContainer ref={toastRef} />
      <FloatingContactButton
        contacts={contacts}
        mainText="Contacto"
        onCopy={(message) => showToast(message, 'info')}
      />
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => showToast('Este es un toast de alerta', 'error')} style={{ marginRight: '10px' }}>
          Mostrar Toast de Alerta
        </button>
        <button onClick={() => showToast('Este es un toast de confirmación', 'success')}>
          Mostrar Toast de Confirmación
        </button>
      </div>
      <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span>Prueba de copia</span>
        <CopyButton
          textToCopy="Texto de prueba para copiar"
          onCopy={(message) => showToast(message, 'info')}
        />
      </div>

      <section style={{ marginTop: '40px' }}>
        <h2>Prueba de ImageGallery (Edición)</h2>
        <ImageGallery images={images} onChange={setImages} mode="edit" />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Prueba de ImageGallery (Galería)</h2>
        <ImageGallery images={images} onChange={setImages} mode="display" thumbnailSize={300} />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Prueba de DocumentList</h2>
        <DocumentList documents={documents} onChange={setDocuments} mode='list' />
      </section>
      <section style={{ marginTop: '40px' }}>
        <h2>Prueba de DocumentList</h2>
        <DocumentList documents={documents} onChange={setDocuments} mode='edit' containerHeight='600px'/>
      </section>
      <section style={{ marginTop: '40px' }}>
        <h2>Prueba de DocumentList</h2>
        <DocumentList documents={documents} onChange={setDocuments} mode='view' />
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Image Gallery - Alternate Display Mode</h2>
              
        <ImageGallery images={images} onChange={setImages} mode="display" labels={{ bannerSelector: true }}/>
      </section>

      <section style={{ marginTop: '40px' }}>
        <h2>Prueba de Mapa Interactivo</h2>
        <Map  
          onChangeCoordinates={(coords) => console.log('Coordenadas seleccionadas:', coords)} 
          height="400px" 
        />
      </section>

      {/* Sección para probar el nuevo modo documentos-con-tipos */}
      <section style={{ marginTop: '40px', border: '2px solid #007bff', padding: '20px', borderRadius: '8px' }}>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
          <DocumentList 
            mode="documentos-con-tipos"
            tiposDocumento={tiposDocumento}
            documentosInmueble={documentosInmueble}
            documentosPropietario={documentosPropietario}
            onChangeInmueble={setDocumentosInmueble}
            onChangePropietario={setDocumentosPropietario}
            containerHeight="500px"
            labels={{
              upload: 'Agregar documento',
              eliminar: 'Quitar',
              nombrePlaceholder: 'Descripción del documento'
            }}
          />
        </div>
      </section>

      <section style={{ marginTop: '40px', border: '2px solid #007bff', padding: '20px', borderRadius: '8px' }}>
        <h2>Loading Spinner Test Section</h2>
        <button onClick={(e) => { e.stopPropagation(); setLoading(true); }}>Activar Loading Spinner</button>
      </section>
    </MangoTemplate>
  );
};

export default Devroom;
