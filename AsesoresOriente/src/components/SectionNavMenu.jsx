import React, { useState } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../styles/SectionNavMenu.css';

const SectionNavMenu = ({ sections }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleClick = (e, id) => {
    e.preventDefault();
    const section = document.getElementById(id);
    if (section) {
      const yOffset = -90; // offset for fixed menu height, adjust as needed
      const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <nav className={`section-nav-menu ${isOpen ? 'open' : ''}`}>
      <button
        className="toggle-button vertical"
        onClick={toggleMenu}
        aria-label="Toggle section navigation"
        aria-expanded={isOpen}
      >
        {isOpen ? <FaChevronLeft /> : <FaChevronRight />}
      </button>
      {isOpen && (
        <ul>
          {sections.map(({ id, label }) => {
            // Replace "Inicio" label with "Inmueble"
            const displayLabel = label === 'Inicio' ? 'Inmueble' : label;
            return (
              <li key={id}>
                <a href={`#${id}`} onClick={(e) => handleClick(e, id)}>
                  {displayLabel}
                </a>
              </li>
            );
          })}
        </ul>
      )}
    </nav>
  );
};

export default SectionNavMenu;
