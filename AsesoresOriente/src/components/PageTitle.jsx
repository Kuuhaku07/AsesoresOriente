import React from 'react';
import '../styles/PageTitle.css';

const PageTitle = ({ children }) => {
  return (
    <h1 className="page-title">
      {children}
    </h1>
  );
};

export default PageTitle;
