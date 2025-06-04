import React from 'react';

const NotFoundPage = ({ message }) => {
  return (
    <div className="not-found-page" style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - No encontrado</h1>
      <p>{message || 'La página que buscas no existe o no se pudo cargar.'}</p>
    </div>
  );
};

export default NotFoundPage;
