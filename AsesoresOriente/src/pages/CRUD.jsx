import React from 'react';
import { Menu } from '../components/Menu';
import DynamicCRUD from '../components/DynamicCRUD';

/**
 * CRUD page rendering menu and dynamic CRUD management component.
 */
const CRUD = () => {
  return (
    <div>
      <Menu />
      <div>
        <DynamicCRUD />
      </div>
    </div>
  );
};

export default CRUD;
