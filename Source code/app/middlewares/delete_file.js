const fs = require('fs');
const path = require('path');
const db = require('../models');
const UserInfor = db.userInfor;


const deleteFile = async (req, res, next) => {
    const id = req.params.id;
    if (!id) return res.send("You must provide user id");
    const user = await UserInfor.findOne({
        where: {
            userId: id
        }
    }).catch(err => res.status(500).send({
        message: `Error while finding user \n ${err}`
    }));
    if (!user) return res.send("User not found ");
    fs.unlinkSync(path.join(`${__dirname}/../public/images/`) + user.avatarName);
    next();
}


module.exports = {
    deleteFile
}