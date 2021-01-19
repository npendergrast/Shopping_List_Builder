import React, { useState, useEffect } from 'react';
import { getIngredients } from '../ApiCalls/apiCalls';

const IngredientList = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    let mounted = true;
    getIngredients().then((items) => {
      if (mounted) {
        setList(items);
      }
    });
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <h1>Ingredient List</h1>
      <ul>
        {list.map((item) => (
          <li key={item.ingredient}>{item.ingredient}</li>
        ))}
      </ul>
    </div>
  );
};

export default IngredientList;
