import React, { useState, useEffect } from 'react';
import '../styles/ToastMessage.css';


/**
 * Componente ToastMessage para mostrar mensajes emergentes.
 * Props:
 * - message: texto del mensaje a mostrar
 * - type: tipo de mensaje ('error', 'success', 'info'), afecta estilos
 * - duration: tiempo en ms que el mensaje se muestra antes de ocultarse (opcional, default 3000)
 */
const ToastMessage = ({ message, type = 'info', duration = 3000 }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [message, duration]);

  if (!visible || !message) return null;

  return (
    <div className={`toast-message toast-${type}`}>
      <span>{message}</span>
      <button className="toast-close" onClick={() => setVisible(false)}>&times;</button>
    </div>
  );
};

export default ToastMessage;
