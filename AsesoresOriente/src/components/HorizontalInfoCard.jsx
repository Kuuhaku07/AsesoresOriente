import React from 'react';
import PropTypes from 'prop-types';
import './HorizontalInfoCard.css';

const HorizontalInfoCard = ({ icon, title, content, link, userInfo, onClick, color }) => {
  const handleClick = (e) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  const Wrapper = link ? 'a' : 'div';

  return (
    <Wrapper
      className={`horizontal-info-card${link ? ' clickable' : ''}`}
      href={link}
      onClick={handleClick}
      target={link ? '_blank' : undefined}
      rel={link ? 'noopener noreferrer' : undefined}
      style={color ? { borderColor: color } : undefined}
    >
      {icon && <div className="card-icon" style={color ? { color: color } : undefined}>{icon}</div>}
      <div className="card-content">
        {title && <div className="card-title">{title}</div>}
        {content && <div className="card-text">{content}</div>}
        {userInfo && <div className="card-user-info">{userInfo}</div>}
      </div>
    </Wrapper>
  );
};

HorizontalInfoCard.propTypes = {
  icon: PropTypes.node,
  title: PropTypes.string,
  content: PropTypes.node,
  link: PropTypes.string,
  userInfo: PropTypes.node,
  onClick: PropTypes.func,
  color: PropTypes.string,
};

HorizontalInfoCard.defaultProps = {
  icon: null,
  title: '',
  content: null,
  link: null,
  userInfo: null,
  onClick: null,
  color: null,
};

export default HorizontalInfoCard;
