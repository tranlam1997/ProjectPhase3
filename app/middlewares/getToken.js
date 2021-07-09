const jwt = require('jsonwebtoken');
const db = require('../models');
const User = db.user;
require('dotenv').config();
const Token = db.token;

const getToken = async (req, res) => {
    const refreshToken = req.body.token;
    if (!refreshToken) return res.status(401).send("RefreshToken not found");
    try {
        const toKen = await Token.findOne({
            where: {
                token: refreshToken
            }
        });
        if (!toKen) return res.status(403).send("Forbidden");
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_KEY, async (err, decoded) => {
            if (err) return res.sendStatus(403);
            const accessToken = jwt.sign({
                id: decoded.id
            }, process.env.ACCESS_TOKEN_KEY, {
                expiresIn: 30
            });
            const user = await User.findOne({
                where: {
                    id: decoded.id
                }
            });
            if (!user) return res.status(404).send("User not found");
            user.accessToken = accessToken;
            await user.save();
            res.json({
                accessToken: accessToken
            });
        });
    } catch (err) {
        return res.send(err);
    }

}

module.exports = { getToken };