import React, { useState, useEffect } from 'react';
import MenuListComponent from '../MenuListComponent/MenuListComponent';
import ButtonComponent from '../ButtonComponent/ButtonComponent';
import { getRecipes, buildShoppingList } from '../ApiCalls/apiCalls';

const BuildShoppingListComponent = () => {
  const [checked, setChecked] = React.useState([]);
  const [list, setList] = useState([]);
  const [clicked, setClicked] = useState(false);
  const [shoppinglist, setShoppingList] = useState([]);
  const [doYouHaveList, setDoYouHaveList] = useState([]);

  useEffect(() => {
    getRecipes().then((items) => {
      setList(items);
    });
  }, []);

  useEffect(() => {
    if (clicked) {
      buildShoppingList(checked).then((result) => {
        setShoppingList(result[0]);
        setDoYouHaveList(result[1]);
      });
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
      {shoppinglist.length > 0 && <h2>Shopping List</h2>}
      {shoppinglist.map((listItem) => {
        return <div>{`${listItem.quantity} x ${listItem.ingredient}`}</div>;
      })}
      {doYouHaveList.length > 0 && <h2>Do you have?</h2>}
      {doYouHaveList.map((listItem) => {
        return <div>{listItem.ingredient}</div>;
      })}
    </div>
  );
};

export default BuildShoppingListComponent;
