import React from 'react';
import '../styles/Banner.css'; // Assuming a separate CSS file for styling

const Banner = () => {
    const InfoBox = ({ name, type, size, rooms, bathrooms }) => {
        return (
            <div className="info-box">
                <h3>{name}</h3>
                <p> {type}</p>
                <p>Tamaño: {size} m²</p>
                <p>Habitaciones: {rooms}</p>
                <p>Baños: {bathrooms}</p>
            </div>
        );
    }

    return (
        <div className="banner">
            <img src="https://postandporch.com/cdn/shop/articles/AdobeStock_209124760.jpg?v=1662575433" alt="Banner" className="banner-image" />
            <div className="arrow left-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M7.28 7.72a.75.75 0 0 1 0 1.06l-2.47 2.47H21a.75.75 0 0 1 0 1.5H4.81l2.47 2.47a.75.75 0 1 1-1.06 1.06l-3.75-3.75a.75.75 0 0 1 0-1.06l3.75-3.75a.75.75 0 0 1 1.06 0Z" clipRule="evenodd" />
                </svg>
            </div>
            <div className="arrow right-arrow">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 0 1 1.06 0l3.75 3.75a.75.75 0 0 1 0 1.06l-3.75 3.75a.75.75 0 1 1-1.06-1.06l2.47-2.47H3a.75.75 0 0 1 0-1.5h16.19l-2.47-2.47a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
            </div>
            <InfoBox 
                name="Propiedad de Ejemplo" 
                type="Venta" 
                size="120" 
                rooms="3" 
                bathrooms="2" 
            />

        </div>
    );
};

export default Banner;
