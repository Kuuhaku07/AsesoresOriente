import React, { useRef } from 'react';
import PageTemplate from '../components/PageTemplate';
import ToastContainer from '../components/ToastContainer';
import FloatingContactButton from '../components/FloatingContactButton';
import CopyButton from '../components/CopyButton';
import { FaWhatsapp, FaCommentDots } from 'react-icons/fa';

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
    </PageTemplate>
  );
};

export default About;
