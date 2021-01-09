// node-postgress setup
const { Pool } = require('pg');
const Keys = require('./keys');
const pool = new Pool({
  user: process.env.user || Keys.user,
  host: process.env.host || Keys.host,
  database: process.env.database || Keys.database,
  password: process.env.password || Keys.password,
  port: process.env.dbPort || '5433',
});

// Find value in array (either case sensitive or not)
const findInArray = (targetArray, checkValue, caseSensitive) => {
  if (!caseSensitive) {
    checkValue = checkValue.toLowerCase();
    targetArray = targetArray.map((element) => element.toLowerCase());
  }
  return targetArray.includes(checkValue);
};

// Provide an array of ingredient objects
async function addIngredient(req, res) {
  const newIngredientArr = req.body;
  let queryResults = [];
  for (const newIngredient of newIngredientArr) {
    try {
      await pool.query(
        `INSERT INTO ingredients(ingredient, id, type_id)
        VALUES( $1 ,uuid_generate_v4(), (SELECT id from ingredient_types WHERE type= $2))`,
        [newIngredient.ingredient, newIngredient.ingredientType]
      );
      queryResults.push(newIngredient.ingredient);
    } catch (err) {
      //consolse.log(err);
    }
  }
  res
    .status(201)
    .send('these ingredients have been added: ' + queryResults.toString());
}

// Update an existing ingredient:
async function editIngredient(req, res) {
  const { newName, ingredient, newType } = req.body;
  let ingredientList = await pool.query('SELECT ingredient FROM ingredients');
  ingredientList = ingredientList.rows.map((element) => element.ingredient);

  if (findInArray(ingredientList, newName, false)) {
    res.send('Ingredient already exists');
  } else {
    const client = await pool.connect();
    try {
      await client.query('BEGIN');
      await client.query(
        'UPDATE ingredients SET type_id = (SELECT id FROM ingredient_types WHERE type= $1) WHERE ingredient= $2',
        [newType, ingredient]
      );
      await client.query(
        'UPDATE ingredients SET ingredient = $1 WHERE ingredient= $2',
        [newName, ingredient]
      );
      await client.query('COMMIT');
      await res.status(200).send('ingredient updated');
    } catch (err) {
      res.status(500).send(err);
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  }
}

const getIngredients = (req, res) => {
  pool.query(
    `SELECT ingredients.ingredient, ingredients.id, ingredient_types.type 
    FROM ingredients 
    INNER JOIN ingredient_types 
    ON ingredients.type_id = ingredient_types.id`,
    (err, results) => {
      if (err) {
        res.send('Ingredient list could not be found');
        throw err;
      }
      res.status(200).json(results.rows);
    }
  );
};

const getIngredientTypes = (req, res) => {
  pool.query(`SELECT type FROM ingredient_types`, (err, results) => {
    if (err) {
      res.send('Ingredient types list could not be found');
      throw err;
    }
    let typeArray = [];
    const selectedRows = results.rows.forEach((element) => {
      typeArray.push(element.type);
    });
    res.status(200).send(typeArray);
  });
};

const deleteIngredient = (req, res) => {
  const { ingredient } = req.body;
  pool.query(
    `DELETE FROM ingredients WHERE ingredient = $1`,
    [ingredient],
    (err, results) => {
      if (err) {
        res.status(500).send('Ingredient could not be deleted');
        throw err;
      }
      res.status(201).send(results.rowCount + ' items deleted');
    }
  );
};

async function addRecipe(req, res) {
  const recipe = req.body[0];
  const ingredients = req.body[1];

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const response = await client.query(
      `INSERT INTO recipes (id, recipe_name, instructions, is_vegetarian)
        VALUES(uuid_generate_v4(), $1, $2, $3) RETURNING *`,
      [recipe.recipeName, recipe.instructions, recipe.is_vege]
    );
    for (const ingredient of ingredients) {
      await client.query(
        `INSERT INTO recipe_ingredients (id, recipe_id, ingredient_id, quantity)
         VALUES(uuid_generate_v4(), $1, (SELECT id FROM ingredients WHERE ingredient= $2), $3)`,
        [response.rows[0].id, ingredient.ingredient, ingredient.number]
      );
    }
    await res.send('Recipe added');
    await client.query('COMMIT');
  } catch (err) {
    res.status(500).send(err);
    await client.query('ROLLBACK');
  } finally {
    client.release();
  }
}

const getRecipes = (req, res) => {
  pool.query(
    `SELECT recipes.recipe_name, recipes.instructions, recipe_ingredients.quantity, ingredients.ingredient, recipes.is_vegetarian
    FROM recipes
    INNER JOIN recipe_ingredients
    ON recipes.id = recipe_ingredients.recipe_id
    INNER JOIN ingredients
    ON recipe_ingredients.ingredient_id = ingredients.id`,
    (err, results) => {
      if (err) {
        res.send('Recipes could not be found');
        throw err;
      }
      res.status(201).json(results.rows);
    }
  );
};

async function buildShoppingList(req, res) {
  recipeArray = req.body;
  let shoppinglistArray = [];
  for (const recipe of recipeArray) {
    const results = await pool.query(
      `SELECT recipe_ingredients.quantity, ingredients.ingredient, ingredient_types.type
    FROM recipes
    JOIN recipe_ingredients
    ON recipes.id = recipe_ingredients.recipe_id
    JOIN ingredients
    ON recipe_ingredients.ingredient_id = ingredients.id
    INNER JOIN ingredient_types
    ON ingredients.type_id = ingredient_types.id
    WHERE recipes.recipe_name = $1`,
      [recipe]
    );
    for (const result of results.rows) {
      let elementIndex = shoppinglistArray.findIndex(
        (e) => e.ingredient === result.ingredient
      );
      if (elementIndex > -1) {
        shoppinglistArray[elementIndex].quantity =
          shoppinglistArray[elementIndex].quantity + result.quantity;
      } else {
        shoppinglistArray.push(result);
      }
    }
  }
  await res.status(200).json(shoppinglistArray);
}

module.exports = {
  addIngredient,
  editIngredient,
  getIngredients,
  getIngredientTypes,
  deleteIngredient,
  addRecipe,
  getRecipes,
  buildShoppingList,
};
