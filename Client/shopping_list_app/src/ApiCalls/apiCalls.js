export const getIngredients = () => {
  return fetch('http://localhost:5000/ingredients/').then((data) =>
    data.json()
  );
};

export const getRecipes = () => {
  return fetch('http://localhost:5000/recipes/').then((data) => data.json());
};
