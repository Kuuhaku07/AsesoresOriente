import React from 'react';
import { Menu } from './Menu';
import ToastMessage from './ToastMessage';
import '../styles/layout.css';
import PageTitle from '../components/PageTitle';
/**
 * PageTemplate component to provide consistent layout and common components.
 * Props:
 * - children: page-specific content to render inside the layout container
 * - toastMessage: message string to show in ToastMessage (optional)
 * - toastType: type of toast message ('error', 'success', 'info') (optional)
 * - toastDuration: duration in ms for toast visibility (optional)
 * - pageClass: additional class for the menu-offset wrapper (optional)
 * - contentClass: additional class for the page-container div (optional)
 */
const PageTemplate = ({
  children,
  pageClass = '',
  contentClass = '',
  title = '',
  headerRight = null,
}) => {
  return (
    <>
      <Menu />
      <div className={`menu-offset ${pageClass}`}>
        <div className={`page-container ${contentClass}`}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            {title && <PageTitle>{title}</PageTitle>}
            {headerRight && (
              <div className="header-right">
                {headerRight}
              </div>
            )}
          </div>
          {children}
        </div>
      </div>
    </>
  );
};

export default PageTemplate;
