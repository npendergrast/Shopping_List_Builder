export const getIngredients = () => {
  return fetch('http://localhost:5000/ingredients/').then((data) =>
    data.json()
  );
};

export const getRecipes = () => {
  return fetch('http://localhost:5000/recipes/').then((data) => data.json());
};

export const buildShoppingList = (listIDs) => {
  console.log(JSON.stringify(listIDs));
  return fetch('http://localhost:5000/shoppinglist/', {
    method: 'POST',
    body: JSON.stringify(listIDs),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => data.json());
};
