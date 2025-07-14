import React from 'react';
import '../styles/PageTitle.css';

const PageTitle = ({ children, headerRight = null }) => {
  return (
    <div className="page-title-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <h1 className="page-title">
        <span className="page-title-text">{children}</span>
      </h1>
      {headerRight && (
        <div className="header-right" style={{ paddingRight: '16px' }}>
          {headerRight}
        </div>
      )}
    </div>
  );
};

export default PageTitle;
