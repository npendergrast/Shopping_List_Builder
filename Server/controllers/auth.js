const { pool } = require('../db/index');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../keys');

const secret = process.env.jwtSecret || jwtSecret;

// Login: check is username exists, then check if password matches username
async function loginUser(req, res) {
  const { userName, password } = req.body;
  pool
    .query(
      `SELECT id, user_name, password
      FROM users
      WHERE user_name = $1`,
      [userName]
    )
    .then((result) => {
      if (result.rows.length < 1) {
        res.status(201).send('username does not exist');
      } else {
        if (result.rows[0].password != password) {
          res.status(201).send('invalid password');
        } else {
          const token = jwt.sign({ userID: result.rows[0].id }, secret, {
            expiresIn: '1h',
          });
          console.log(token);
          res.status(201).json({ token: token });
        }
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
    });
}

module.exports = {
  loginUser,
};
