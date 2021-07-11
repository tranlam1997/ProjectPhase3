const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateAccessToken = async (req, res, user, roles) => {
    const accessToken = jwt.sign({
        id: user.id,
        roles: roles,
        email: user.email
    }, process.env.ACCESS_SECRET_KEY, {
        expiresIn: 360000
    });
      req.accessToken = accessToken;
}