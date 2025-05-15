import React, { useRef } from 'react';
import PageTemplate from '../components/PageTemplate';
import ToastContainer from '../components/ToastContainer';

const About = () => {
  const toastRef = useRef(null);

  const showToast = (message, type) => {
    if (toastRef.current) {
      toastRef.current.addToast(message, type, 5000);
    }
  };

  return (
    <PageTemplate pageClass="about-layout" contentClass="about-content" title="Sobre Nosotros">
      <p>Lalalalava chichichichicken.</p>
      <ToastContainer ref={toastRef} />
      <div style={{ marginTop: '20px' }}>
        <button onClick={() => showToast('Este es un toast de alerta', 'error')} style={{ marginRight: '10px' }}>
          Mostrar Toast de Alerta
        </button>
        <button onClick={() => showToast('Este es un toast de confirmación', 'success')}>
          Mostrar Toast de Confirmación
        </button>
      </div>
    </PageTemplate>
  );
};

export default About;
