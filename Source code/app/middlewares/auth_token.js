const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateJwt = async (req, res, next) => {
  let authHeader = req.headers['authorization']
  if (!authHeader)
    return res.status(403).send({
      message: 'You are not logged in. Please log in and try again'
    });
  authHeader = authHeader.trim().split(' ');
  const token = authHeader.length > 1 ? authHeader[1] : authHeader[0];
  if (!token) {
    return res.status(403).send({
      message: 'You are not logged in. Please log in and try again'
    });
  }

  jwt.verify(token, process.env.ACCESS_SECRET_KEY, async (err, user) => {
    if (err) {
      return res.status(403).send({
        message: 'Forbidden'
      });
    }
    req.user = user;
    next();

  });
};

module.exports = {
  authenticateJwt
};