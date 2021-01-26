import React, { useState, useEffect } from 'react';
import MenuListComponent from '../MenuListComponent/MenuListComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { getRecipes, buildShoppingList } from '../ApiCalls/apiCalls';

const BuildShoppingListComponent = () => {
  const [checked, setChecked] = React.useState([]);
  const [list, setList] = useState([]);
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    getRecipes().then((items) => {
      setList(items);
    });
  }, []);

  useEffect(() => {
    if (clicked) {
      buildShoppingList(checked).then((result) => console.log(result));
      setClicked(false);
    }
  }, [clicked, checked]);

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, true);
    }
    setChecked(newChecked);
  };

  return (
    <div>
      <MenuListComponent
        list={list}
        onChange={(value) => handleToggle(value)}
        checked={checked}
      />
      <ButtonComponent onClick={() => setClicked(true)} />
    </div>
  );
};

export default BuildShoppingListComponent;
