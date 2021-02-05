const { pool } = require('./db/index');

// Find value in array (either case sensitive or not)
const findInArray = (targetArray, checkValue, caseSensitive) => {
  if (!caseSensitive) {
    checkValue = checkValue.toLowerCase();
    targetArray = targetArray.map((element) => element.toLowerCase());
  }
  return targetArray.includes(checkValue);
};

//
// const addUser = (req, res) => {
//   const { userName, password, first, last } = req.body;
//   console.log(userName);
//   pool.query(
//     `INSERT INTO users(id, user_name, password, name_first, name_last)
//   VALUES(uuid_generate_v4(), $1, $2, $3, $4)`,
//     [userName, password, first, last]
//   );
// };

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
      consolse.log(err);
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
    `SELECT ingredients.ingredient, ingredient_types.type, ingredients.include, ingredients.id
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
  pool.query(`SELECT type, id FROM ingredient_types`, (err, results) => {
    if (err) {
      res.send('Ingredient types list could not be found');
      throw err;
    }
    const sortedTypes = [...results.rows].sort(function (a, b) {
      var x = a.type.toLowerCase();
      var y = b.type.toLowerCase();
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return 0;
    });

    res.status(200).send(sortedTypes);
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

// const getRecipes = (req, res) => {
//   pool.query(
//     `SELECT recipes.recipe_name, recipes.instructions, recipe_ingredients.quantity, ingredients.ingredient, recipes.is_vegetarian
//     FROM recipes
//     INNER JOIN recipe_ingredients
//     ON recipes.id = recipe_ingredients.recipe_id
//     INNER JOIN ingredients
//     ON recipe_ingredients.ingredient_id = ingredients.id`,
//     (err, results) => {
//       if (err) {
//         res.send('Recipes could not be found');
//         throw err;
//       }
//       res.status(201).json(results.rows);
//     }
//   );
// };

const getRecipesList = (req, res) => {
  pool.query(
    `SELECT recipes.id, recipes.recipe_name, recipes.is_vegetarian
    FROM recipes`,
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
  let includeArray = [];
  let excludeArray = [];
  let retrunArray = [];
  for (const recipe of recipeArray) {
    const results = await pool.query(
      `SELECT recipe_ingredients.quantity, ingredients.ingredient, ingredients.include, ingredient_types.type
    FROM recipes
    JOIN recipe_ingredients
    ON recipes.id = recipe_ingredients.recipe_id
    JOIN ingredients
    ON recipe_ingredients.ingredient_id = ingredients.id
    INNER JOIN ingredient_types
    ON ingredients.type_id = ingredient_types.id
    WHERE recipes.id = $1`,
      [recipe]
    );
    for (const result of results.rows) {
      let elementIndex = includeArray.findIndex(
        (e) => e.ingredient === result.ingredient
      );
      let elementIndex2 = excludeArray.findIndex(
        (e) => e.ingredient === result.ingredient
      );
      if (elementIndex > -1) {
        includeArray[elementIndex].quantity =
          includeArray[elementIndex].quantity + result.quantity;
      } else if (elementIndex2 > -1) {
        excludeArray[elementIndex2].quantity =
          excludeArray[elementIndex2].quantity + result.quantity;
      } else {
        if (result.include) {
          includeArray.push(result);
        } else {
          excludeArray.push(result);
        }
      }
    }
  }
  retrunArray.push(includeArray, excludeArray);
  await res.status(200).json(retrunArray);
}

module.exports = {
  addIngredient,
  editIngredient,
  getIngredients,
  getIngredientTypes,
  deleteIngredient,
  addRecipe,
  getRecipesList,
  buildShoppingList,
  // addUser,
};
