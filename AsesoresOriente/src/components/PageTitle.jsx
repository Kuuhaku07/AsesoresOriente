import React from 'react';
import '../styles/PageTitle.css';

const PageTitle = ({ children }) => {
  return (
    <h1 className="page-title">
      <span className="page-title-text">{children}</span>
    </h1>
  );
};

export default PageTitle;
