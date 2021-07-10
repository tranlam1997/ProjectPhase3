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
    const refreshToken = jwt.sign({
        id: user.id,
        role: roles,
        email: user.email
    }, process.env.REFRESH_SECRET_KEY);
    user.accessToken = accessToken;
    user.refreshToken = refreshToken;
    try {
        await user.save();
        req.accessToken = accessToken;
        req.refreshToken = refreshToken;
    } catch (err) {
        res.send(err);
    }


}