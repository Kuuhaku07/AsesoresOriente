import React, { useRef, useState } from 'react';
import PageTemplate from '../components/PageTemplate';
import ToastContainer from '../components/ToastContainer';
import FloatingContactButton from '../components/FloatingContactButton';
import CopyButton from '../components/CopyButton';
import { FaWhatsapp, FaCommentDots } from 'react-icons/fa';
import ImageGallery from '../components/ImageGallery';
import DocumentList from '../components/DocumentList';

const About = () => {
  const toastRef = useRef(null);

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

  // Sample images state for testing ImageGallery
  const [images, setImages] = useState([]);

  // Sample documents state for testing DocumentList
  const [documents, setDocuments] = useState([

  ]);

  return (
    <PageTemplate pageClass="about-layout" contentClass="about-content" title="Sobre Nosotros">
      <p>Lalalalava chichichichicken.</p>
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

    </PageTemplate>
  );
};

export default About;
