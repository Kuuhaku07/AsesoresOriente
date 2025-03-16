import React from 'react';
import './styles/index.css';
import { Menu } from './components/Menu';
import Banner from './components/Banner';
import SearchBar from './components/SearchBar'; // Import the SearchBar component


export function App(){
    return (
        
        <div>
            <Menu />
            <Banner />
            <SearchBar /> {/* Add the SearchBar component below the Banner */}


        </div>
             

    )
}
