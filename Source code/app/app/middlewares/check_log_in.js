const db = require('../models');
const bcrypt = require('bcrypt');
const User = db.user;
const Role = db.role;

const checkLogIn = async (req, res, next) => {
    const user = await User.findOne({
        where: {
            userName: req.body.userName
        },
        include: Role
    }).catch(err => res.status(500).send({
        message: `Error while finding user`,
        error: err
    }));
    if (!user) {
        return res.status(404).send({
            message: 'User Not found.'
        });
    }

    // Check password
    const valid = bcrypt.compareSync(
        req.body.password,
        user.password
    );
    if (!valid) {
        return res.status(400).send({
            message: 'Password provided is invalid'
        });
    } else {
        req.user = user;
        next();
    }
}

module.exports = {
    checkLogIn
};