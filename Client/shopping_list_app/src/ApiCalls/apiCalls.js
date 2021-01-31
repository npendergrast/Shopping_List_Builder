export const getIngredients = () => {
  return fetch('http://localhost:5000/ingredients/').then((data) =>
    data.json()
  );
};

export const getRecipes = () => {
  return fetch('http://localhost:5000/recipes/').then((data) => data.json());
};

export const buildShoppingList = (listIDs) => {
  return fetch('http://localhost:5000/shoppinglist/', {
    method: 'POST',
    body: JSON.stringify(listIDs),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => data.json());
};

export const userLogin = (credentials) => {
  return fetch('http://localhost:5000/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((data) => data.json());
};
