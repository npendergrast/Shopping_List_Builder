const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;

// Other express packages to use: bcrypt (for password hashing), express-validator (for validating emails etc)

const controller = require('./queries.js');
const auth = require('./controllers/auth');
const isAuth = require('./middleware/is-auth');

// Use json parser for incoming/outgoing json http
app.use(express.json());
// Use urlencoded only if using html form data
app.use(
  express.urlencoded({
    extended: true,
  })
);

// Set response headers to allow CORS (different server/client urls)
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Acces-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if ('OPTIONS' === req.method) {
    res.send(200);
  } else {
    next();
  }
});

// Ingredient routes
app.post('/ingredients', isAuth, controller.addIngredient);
app.put('/ingredients', controller.editIngredient);
app.get('/ingredients', controller.getIngredients);
app.delete('/ingredients', controller.deleteIngredient);
app.get('/ingredienttypes', controller.getIngredientTypes);

// Recipe routes
app.post('/recipes', controller.addRecipe);
app.get('/recipes', controller.getRecipesList);

// Shopping list routes
app.post('/shoppinglist', controller.buildShoppingList);

// Auth routes
// app.post('/user', controller.addUser);
app.post('/login', auth.loginUser);

// 404 Response
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

app.listen(PORT, () => {
  console.log(`running on port ${PORT}`);
});
