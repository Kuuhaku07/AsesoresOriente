// src/pages/Home.jsx
import React from 'react';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';
import PropertiesGrid from '../components/PropertiesGrid';
import { Menu } from '../components/Menu';
import '../styles/Home.css';

// Home.jsx - Ejemplo de mock data actualizado
const mockProperties = [
  {
    id: 1,
    name: "Casa en la playa con vista al mar",
    type: "Venta",
    status: "Disponible",
    location: "Playa del Carmen, Quintana Roo",
    size: "180",
    rooms: "4",
    bathrooms: "3",
    price: "$3,200,000",
    businessTypes: ["Venta"],
    imageUrl: "https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d",
    detailsLink: "/propiedad/1"
  },
  // ... más propiedades
];
const Home = () => {
  return (
    <div className="home-page">
      <Menu/>
      <Banner 
        properties={mockProperties} 
        autoPlay={true} 
        interval={7000}
        defaultImage="https://www.rawls-campbellagency.com/sites/default/files/styles/large/public/blogpost-1.jpg?itok=lDKT1OHZ" 
      />
      <div className="search-section">
        <SearchBar />
      </div>
      <div className="featured-properties">
        <h2>Propiedades Destacadas</h2>
        <PropertiesGrid properties={mockProperties} />
      </div>
    </div>
  );
};

export default Home;