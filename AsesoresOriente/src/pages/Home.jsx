import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';
import PropertiesGrid from '../components/PropertiesGrid';
import { Menu } from '../components/Menu';
import '../styles/Home.css';

const Home = () => {
  const [newestProperties, setNewestProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);

  useEffect(() => {
    // Fetch newest properties for banner
    fetch('/api/inmueble/newest')
      .then(res => res.json())
      .then(data => setNewestProperties(data))
      .catch(err => console.error('Error fetching newest properties:', err));

    // Fetch featured properties for grid
    fetch('/api/inmueble/featured')
      .then(res => res.json())
      .then(data => setFeaturedProperties(data))
      .catch(err => console.error('Error fetching featured properties:', err));
  }, []);

  return (
    <div className="home-page">
      <Menu/>
      <Banner 
        properties={newestProperties} 
        autoPlay={true} 
        interval={7000}
        defaultImage="https://www.rawls-campbellagency.com/sites/default/files/styles/large/public/blogpost-1.jpg?itok=lDKT1OHZ" 
      />
      <div className="search-section">
        <SearchBar />
      </div>
      <div className="featured-properties">
        <h2>Propiedades Destacadas</h2>
        <PropertiesGrid properties={featuredProperties} />
      </div>
    </div>
  );
};

export default Home;
