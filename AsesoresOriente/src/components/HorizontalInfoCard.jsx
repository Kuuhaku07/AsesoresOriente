import React from 'react';
import PropTypes from 'prop-types';
import './HorizontalInfoCard.css';


const HorizontalInfoCard = ({ icon, title, content, link, onClick, color, fixedImageSize }) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  const Wrapper = link ? 'a' : 'div';

  return (
    <Wrapper
      className={`horizontal-info-card${link || onClick ? ' clickable' : ''}${fixedImageSize ? ' fixed-image-size' : ''}`}
      href={link}
      onClick={handleClick}
      target={link ? '_blank' : undefined}
      rel={link ? 'noopener noreferrer' : undefined}
      style={color ? { borderLeft: `4px solid ${color}` } : undefined}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onClick(e);
          e.preventDefault();
        }
      } : undefined}
    >
      {(icon || fixedImageSize) && (
        <div className="card-image">
          {icon ? (typeof icon === 'string' ? <img src={icon} alt={title || ''} /> : icon) : null}
        </div>
      )}
      <div className="card-content">
        {title && <div className="card-title">{title}</div>}
        {content && <div className="card-text">{content}</div>}
      </div>
    </Wrapper>
  );
};

HorizontalInfoCard.propTypes = {
  icon: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  title: PropTypes.string,
  content: PropTypes.string,
  link: PropTypes.string,
  onClick: PropTypes.func,
  color: PropTypes.string,
  fixedImageSize: PropTypes.bool,
};

HorizontalInfoCard.defaultProps = {
  icon: null,
  title: '',
  content: '',
  link: null,
  onClick: null,
  color: null,
  fixedImageSize: true,
};

export default HorizontalInfoCard;