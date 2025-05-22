import React from 'react';
import { Menu } from '../components/Menu';
import SearchBarCRUD from '../components/SearchBar(CRUD)';

const CRUD = () => {
  return (
    <div>
      <Menu />
      <div>
        <SearchBarCRUD />
      </div>
    </div>
  );
};

export default CRUD;
