import React from 'react';
import '../styles/SearchBar.css'; // Import the CSS for styling

const SearchBar = () => {
    return (
        <div className="search-bar">
            <input type="text" placeholder="Ubicación" />
            <select>
                <option value="">Tipo de inmueble</option>
                <option value="casa">Casa</option>
                <option value="departamento">Departamento</option>
                <option value="local">Local</option>
            </select>
            <select>
                <option value="">Estado de la propiedad</option>
                <option value="nuevo">Nuevo</option>
                <option value="usado">Usado</option>
            </select>
            <select>
                <option value="">Tipo de negocio</option>
                <option value="venta">Venta</option>
                <option value="alquiler">Alquiler</option>
            </select>
            <select>
                <option value="">Habitaciones</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5+</option>
            </select>
            <select>
                <option value="">Baños</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4+</option>
            </select>
            <input type="number" placeholder="Precio mínimo" />
            <input type="number" placeholder="Precio máximo" />
            <button>Buscar</button>
        </div>
    );
};


export default SearchBar;
