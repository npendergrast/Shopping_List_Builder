const { pool } = require('../db/index');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const { secret } = require('../keys');

const tokenSecret = process.env.jwtSecret || secret;

//Login: check is username exists, then check if password matches username
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
        res
          .status(201)
          .json({ success: false, message: 'username does not exist!' });
      } else {
        if (result.rows[0].password != password) {
          res
            .status(403)
            .json({ success: false, message: 'incorrect password!' });
        } else {
          const token = jwt.sign({ userID: result.rows[0].id }, tokenSecret, {
            expiresIn: '1h',
          });
          const expires = Date.now() + 60 * 60 * 1000;
          console.log(expires);
          res.status(200).json({
            success: true,
            message: 'login successful',
            token: token,
            userID: result.rows[0].id,
            expires: expires,
          });
        }
      }
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
    });
}

// function loginUser(req, res, next) {
//   console.log(req.session);
//   req.session.isLoggedIn = true;
//   res.session;
// }

module.exports = {
  loginUser,
};

// const token = jwt.sign({ userID: result.rows[0].id }, tokenSecret, {
//   expiresIn: '1h',
// });
// console.log(token);
// res.status(201).json({ token: token });
