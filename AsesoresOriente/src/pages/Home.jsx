import React, { useEffect, useState } from 'react';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar';
import PropertiesGrid from '../components/PropertiesGrid';
import MangoTemplate from '../components/MangoTemplate';

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
    <MangoTemplate>
      <Banner 
        properties={newestProperties} 
        autoPlay={true} 
        interval={7000}
        defaultImage="https://www.rawls-campbellagency.com/sites/default/files/styles/large/public/blogpost-1.jpg?itok=lDKT1OHZ" 
      />
      <div className="w-full mx-auto pt-4">
        <SearchBar />
      </div>
      <div className="max-w-7xl w-full mx-auto p-6 md:p-4">
        <h2 className="text-center mb-12 md:mb-6 text-text text-xlarge md:text-large">Propiedades Destacadas</h2>
        <PropertiesGrid properties={featuredProperties} singleRow={true} />
      </div>
    </MangoTemplate>
  );
};

export default Home;
