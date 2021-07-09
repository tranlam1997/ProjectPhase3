const fs = require("fs");
const path = require('path');
const db = require("../models");
const UserInfor = db.userInfor;

const uploadFiles = async (req, res) => {
  try {
    console.log(req.file);
    if (req.file == undefined) {
      return res.send(`You must select a file.`);
    }
    const id = req.params.id;
    if (!id) return res.send("You must provide user id");
    const user = await UserInfor.findOne({
      where: {
        userId: id
      }
    });
    if (!user) return res.send("User not found ");
    user.avatar = fs.readFileSync(
      path.join(`${__dirname}/../public/images/`) + id + "." + req.file.originalname
    );
    user.avatarname = `${id}.${req.file.originalname}`;
    try {
      await user.save();
      return res.send(`File has been uploaded.`);
    } catch (err) {
      res.send(err);
    }
  } catch (error) {
    return res.send(`Error when trying upload images: ${error}`);
  }
};


module.exports = {
  uploadFiles
};