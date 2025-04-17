import React from 'react';
import { Menu } from '../components/Menu';
import Banner from '../components/Banner';
import SearchBar from '../components/SearchBar'; // Import the SearchBar component


const Home = () => {
    return (
        <div>
        <Menu />
        <Banner />
        <SearchBar /> {/* Add the SearchBar component below the Banner */}


        </div>

    );
};

export default Home;
