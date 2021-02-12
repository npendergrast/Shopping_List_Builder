const { pool } = require('../db/index');
const { findInArray } = require('../utility-functions/utility');

// Test if ingredient already exists and send response message if so
async function isIngredientUnique(res, checkValue) {
  let ingredientList;
  try {
    ingredientList = await pool.query('SELECT ingredient FROM ingredients');
    ingredientList = ingredientList.rows.map((element) => element.ingredient);
    if (findInArray(ingredientList, checkValue, false)) {
      return false;
    } else return true;
  } catch (err) {
    res.status(500).json({ success: false, message: 'something went wrong!' });
    throw err;
  }
}

async function doesTypeExist(res, checkValue) {
  let typeList;
  try {
    typeList = await pool.query('SELECT type FROM ingredient_types');
    typeList = typeList.rows.map((element) => element.type);
    if (findInArray(typeList, checkValue, true)) {
      return true;
    } else return false;
  } catch (err) {
    res.status(500).json({ success: false, message: 'something went wrong!' });
    throw err;
  }
}

module.exports = {
  isIngredientUnique,
  doesTypeExist,
};
