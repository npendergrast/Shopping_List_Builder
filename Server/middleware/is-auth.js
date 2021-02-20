const jwt = require('jsonwebtoken');
const { secret } = require('../keys');

const tokenSecret = process.env.jwtSecret || secret;

module.exports = (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    res.json({ auth: false });
    throw error;
  }
  const token = authHeader.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, tokenSecret);
  } catch (err) {
    err.statusCode = 500;
    res.json({ auth: false });
    throw err;
  }
  if (!decodedToken) {
    const error = new Error('Not authenticated');
    error.statusCode = 401;
    res.json({ auth: false });
    throw error;
  }
  req.userID = decodedToken.userID;
  next();
};
