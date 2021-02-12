const express = require('express');
const cors = require('cors');
const session = require('express-session');
const PORT = process.env.PORT || 5000;
const app = express();

// Other express packages to use: bcrypt (for password hashing), express-validator (for validating emails etc)

const controller = require('./queries.js');
const auth = require('./controllers/auth');
const isAuth = require('./middleware/is-auth');
const { secret } = require('./keys');

// Use json parser for incoming/outgoing json http
app.use(express.json());
// Use urlencoded only if using html form data
app.use(
  express.urlencoded({
    extended: true,
  })
);

// app.use(
//   session({
//     secret: secret,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//   })
// );

// Set response headers to allow CORS (different server/client urls)
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Acces-Control-Allow-Methods',
//     'PUT, GET, POST, PATCH, DELETE, OPTIONS'
//   );
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   );
//   if ('OPTIONS' === req.method) {
//     console.log('test1');
//     res.send(200);
//   } else {
//     next();
//   }
// });

app.use(cors());

// Ingredient routes
app.get('/ingredients', isAuth, controller.getIngredients);
app.post('/ingredients', isAuth, controller.addIngredient);
app.put('/ingredients', isAuth, controller.editIngredient);
app.delete('/ingredients', controller.deleteIngredient);
app.get('/ingredienttypes', isAuth, controller.getIngredientTypes);

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
