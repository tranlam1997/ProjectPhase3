const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateAccessToken =(user,role,roles) => {
    return jwt.sign({
        id: user.id,
        roleId: role.id,
        roles : roles,
        email: user.email
    }, process.env.ACCESS_SECRET_KEY, {
        expiresIn: 360000
    });
}