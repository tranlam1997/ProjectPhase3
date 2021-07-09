const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.generateAccessToken = async (req, res, user, role, staffId, email) => {
    role.then(async (data) => {
        const accessToken = jwt.sign({
            id: user.id,
            role: data,
            staffId : staffId,
            email: email
        }, process.env.ACCESS_SECRET_KEY, {
            expiresIn: 360000
        });
        const refreshToken = jwt.sign({
            id: user.id,
            role: data,
            staffId: staffId
        }, process.env.REFRESH_SECRET_KEY);
        user.accessToken = accessToken;
        user.refreshToken = refreshToken;
        try {
            await user.save();
            res.json({
                accessToken: accessToken,
                refreshToken: refreshToken
            });
        } catch (err) {
            res.send(err);
        }
    }).catch(err => {
        res.send(err);
    })


}