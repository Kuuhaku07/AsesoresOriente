import React from 'react';
import PropTypes from 'prop-types';
import '../styles/InfoBox.css';

const InfoBox = ({
  title,
  children,
  backgroundColor,
  titleColor,
  textColor,
  titleFontSize,
  textFontSize,
  padding,
  margin,
  className,
  underlineWidth,
  underlineColor,
  underlineThickness,
  style,
}) => {
  const containerStyle = {
    backgroundColor,
    padding,
    margin,
    ...style,
    '--underline-width': underlineWidth, // Pasamos las props a variables CSS
    '--underline-color': underlineColor,
    '--underline-thickness': underlineThickness,
  };

  const titleStyle = {
    color: titleColor,
    fontSize: titleFontSize,
  };

  const contentStyle = {
    color: textColor,
    fontSize: textFontSize,
  };

  return (
    <div className={`custom-info-box ${className || ''}`} style={containerStyle}>
      {title && (
        <h2 className="custom-info-box-title" style={titleStyle}>
          {title}
        </h2>
      )}
      <div className="custom-info-box-content" style={contentStyle}>
        {children}
      </div>
    </div>
  );
};

InfoBox.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
  backgroundColor: PropTypes.string,
  titleColor: PropTypes.string,
  textColor: PropTypes.string,
  titleFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  textFontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  padding: PropTypes.string,
  margin: PropTypes.string,
  className: PropTypes.string,
  underlineWidth: PropTypes.string,       // Nueva prop para ancho del subrayado
  underlineColor: PropTypes.string,      // Nueva prop para color del subrayado
  underlineThickness: PropTypes.string,  // Nueva prop para grosor del subrayado
  style: PropTypes.object,
};

InfoBox.defaultProps = {
  title: '',
  backgroundColor: 'var(--color-white)',
  titleColor: 'var(--color-text-primary)',
  textColor: 'var(--color-text-secondary)',
  titleFontSize: '1.375rem',
  textFontSize: '1rem',
  padding: 'var(--spacing-lg) var(--spacing-xl)',
  margin: 'var(--spacing-xl) 0',
  className: '',
  underlineWidth: '50px',               // Valor por defecto
  underlineColor: 'currentColor',       // Hereda el color del título por defecto
  underlineThickness: '2px',            // Valor por defecto
  style: {},
};

export default InfoBox;