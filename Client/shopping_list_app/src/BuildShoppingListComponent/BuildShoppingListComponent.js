import React, { useState, useEffect } from 'react';
import MenuListComponent from '../MenuListComponent/MenuListComponent';
import { getRecipes } from '../ApiCalls/apiCalls';

const BuildShoppingListComponent = () => {
  const [checked, setChecked] = React.useState([1]);
  const [list, setList] = useState([]);

  useEffect(() => {
    let mounted = true;
    getRecipes().then((items) => {
      if (mounted) {
        setList(items);
      }
    });
    return () => (mounted = false);
  }, []);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  return (
    <MenuListComponent
      list={list}
      onChange={(value) => handleToggle(value)}
      checked={checked}
    />
  );
};

export default BuildShoppingListComponent;
