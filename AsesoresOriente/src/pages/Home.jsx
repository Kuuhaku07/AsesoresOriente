// src/pages/Home.jsx
import React from 'react';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';
import { Menu } from '../components/Menu';

const mockProperties = [
  {
    id: 1,
    name: "Casa en la playa con vista al mar",
    type: "Venta",
    size: "180",
    rooms: "4",
    bathrooms: "3",
    imageUrl: "https://images.unsplash.com/photo-1615571022219-eb45cf7faa9d?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y2FzYSUyMGRlJTIwbGElMjBwbGF5YXxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 2,
    name: "Moderno departamento en zona céntrica",
    type: "Alquiler",
    size: "90",
    rooms: "2",
    bathrooms: "1",
    imageUrl: "https://postandporch.com/cdn/shop/articles/AdobeStock_209124760.jpg?v=1662575433",
    detailsLink: "/propiedad/2" 

  },
  {
    id: 3,
    name: "Casa campestre con amplio jardín",
    type: "Venta",
    size: "220",
    rooms: "3",
    bathrooms: "2",
    // imageUrl: "" // Prueba el fallback a imagen por defecto
  }
];

const Home = () => {
  return (
    <div>
        <Menu/>
        <Banner 
            properties={mockProperties} 
            autoPlay={true} 
            interval={7000}
            defaultImage="https://www.rawls-campbellagency.com/sites/default/files/styles/large/public/blogpost-1.jpg?itok=lDKT1OHZ" 
        />
        <SearchBar />
    </div>
  );
};

export default Home;