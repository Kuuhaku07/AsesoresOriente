// src/pages/Home.jsx
import React from 'react';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';
import PropertiesGrid from '../components/PropertiesGrid';
import { Menu } from '../components/Menu';
import '../styles/Home.css';

const mockProperties = [
  {
    id: 1,
    name: "Casa en la playa con vista al mar",
    type: "Venta",
    location: "Playa del Carmen, Quintana Roo",
    size: "180",
    rooms: "4",
    bathrooms: "3",
    price: "$3,200,000 ",
    imageUrl: "https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FzYSUyMGRlJTIwbGElMjBwbGF5YXxlbnwwfHwwfHx8MA%3D%3D",
    detailsLink: "/propiedad/1"
  },
  {
    id: 2,
    name: "Moderno departamento en zona céntrica",
    type: "Alquiler",
    location: "Condesa, CDMX",
    size: "90",
    rooms: "2",
    bathrooms: "1",
    price: "$18,000 /mes",
    imageUrl: "https://postandporch.com/cdn/shop/articles/AdobeStock_209124760.jpg?v=1662575433",
    detailsLink: "/propiedad/2"
  },
  {
    id: 3,
    name: "Casa campestre con amplio jardín",
    type: "Venta",
    location: "Valle de Bravo, Estado de México",
    size: "220",
    rooms: "3",
    bathrooms: "2",
    price: "$4,500,000 ",
    // imageUrl dejado vacío para probar el fallback
    detailsLink: "/propiedad/3"
  }
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