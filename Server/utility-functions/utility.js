// const { pool } = require('../db/index');

// Find value in array (either case sensitive or not)
const findInArray = (targetArray, checkValue, caseSensitive) => {
  if (!caseSensitive) {
    checkValue = checkValue.toLowerCase();
    targetArray = targetArray.map((element) => element.toLowerCase());
  }
  return targetArray.includes(checkValue);
};
// Sort array of objects alphabetically by property
const sortObjArray = (array, propertyToSortOn) => {
  return [...array].sort(function (a, b) {
    const x = a[propertyToSortOn].toLowerCase();
    const y = b[propertyToSortOn].toLowerCase();
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
    return 0;
  });
};

// Test if ingredient already exists and send response message if so
// async function testIngredient(req, res, checkValue) {
//   let ingredientList;
//   try {
//     ingredientList = await pool.query('SELECT ingredient FROM ingredients');
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ success: false, message: 'something went wrong!' });
//   }
//   ingredientList = ingredientList.rows.map((element) => element.ingredient);
//   console.log('first stop');

//   if (findInArray(ingredientList, checkValue, false)) {
//     res
//       .status(500)
//       .json({ success: false, message: 'ingredient already exists' });
//     return false;
//   } else return true;
// }

module.exports = {
  findInArray,
  sortObjArray,
  //   testIngredient,
};
