import React from 'react';
import ImageGallery from '../ImageGallery';
import DocumentList from '../DocumentList';

const MultimediaSection = ({
  activeMultimediaTab,
  setActiveMultimediaTab,
  formData,
  handleImagesChange,
  tiposDocumento,
  documentosInmueble,
  documentosPropietario,
  setDocumentosInmueble,
  setDocumentosPropietario,
}) => {
  return (
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
              mode="documentos-con-tipos"
              tiposDocumento={tiposDocumento}
              documentosInmueble={documentosInmueble}
              documentosPropietario={documentosPropietario}
              onChangeInmueble={setDocumentosInmueble}
              onChangePropietario={setDocumentosPropietario}
              containerHeight="400px"
              allowedFileTypes={['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt']}
            />
          </>
        )}
      </div>
    </section>
  );
};

export default MultimediaSection;
