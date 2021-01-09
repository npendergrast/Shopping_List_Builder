const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Other express packages to use: bcrypt (for password hashing), express-validator (for validating emails etc)

const db = require('./queries.js');

// Use json parser for incoming/outgoing json http
app.use(express.json());

// Set response headers to allow CORS (different server/client urls)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); // Could change '*' to specific url e.g. netlify address
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

//app.use(express.urlencoded()); //(only if using html form data)

// Ingredient routes
app.post('/ingredients', db.addIngredient);
app.put('/ingredients', db.editIngredient);
app.get('/ingredients', db.getIngredients);
app.delete('/ingredients', db.deleteIngredient);
app.get('/ingredientTypes', db.getIngredientTypes);

// Recipe routes
app.post('/recipes', db.addRecipe);
app.get('/recipes', db.getRecipes);

// Shopping list routes
app.post('/shoppinglist', db.buildShoppingList);

app.use((req, res, next) => {
  res.status(404).send('Page Not Found');
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
