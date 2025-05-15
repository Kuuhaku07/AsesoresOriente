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
  title='',
}) => {
  return (
    <>
      <Menu />

      <div className={`menu-offset ${pageClass}`}>
        <PageTitle>{title}</PageTitle>
        <div className={`page-container ${contentClass}`}>
          {children}
        </div>
      </div>
    </>
  );
};

export default PageTemplate;
