export const getIngredients = (token) => {
  return fetch('http://localhost:5000/ingredients/', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  }).then((data) => data.json());
};

export const getIngredientTypes = (token) => {
  return fetch('http://localhost:5000/ingredienttypes', {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  })
    .then((data) => data.json())
    .catch(() => {
      console.log('could not connect');
    });
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

export const addIngredient = (data, token) => {
  return fetch('http://localhost:5000/ingredients', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })
    .then((data) => data.json())
    .catch(() => {
      return { success: false, message: 'could not connect to server' };
    });
};

export const editIngredient = (data, token) => {
  return fetch('http://localhost:5000/ingredients', {
    method: 'PUT',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token,
    },
  })
    .then((data) => data.json())
    .catch(() => {
      return {
        auth: true,
        success: false,
        message: 'could not connect to server',
      };
    });
};

export const deleteIngredient = (data) => {
  return fetch('http://localhost:5000/ingredients', {
    method: 'DELETE',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => data.json())
    .catch(() => {
      return { success: false, message: 'could not connect to server' };
    });
};

export const userLogin = (credentials) => {
  return fetch('http://localhost:5000/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((data) => data.json())
    .catch(() => {
      return { success: false, message: 'could not connect to server' };
    });
};
