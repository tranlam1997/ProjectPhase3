const fs = require('fs');
const path = require('path');
const db = require('../models');
const UserInfor = db.userInfor;


const uploadFile = async (req, res) => {
  if (req.file == undefined) {
    return res.send({message : `You must select a file.`});
  }
  const id = req.user.id;
  if (!id) return res.send({message: 'You must provide user id'});
  const user = await UserInfor.findOne({
    where: {
      userId: id
    }
  }).catch(err => res.status(500).send({
    message: `Error while fiding user.`,
    error: err.message
  }));
  if (!user) return res.status(404).send({message: 'User not found '});
  user.avatar = fs.readFileSync(
    path.join(`${__dirname}/../public/images/`) + id + '.' + req.file.originalname
  );
  user.avatarName = `${id}.${req.file.originalname}`;
  await user.save().catch(err => res.status(500).send({
    message: `Error while saving data.`,
    error: err.message
  }));
  if (req.path === '/user/infor/uploadAvatar') {
    return res.status(200).send({message : `File has been uploaded.`});
  } else {
    return res.status(200).send({message : `File has been updated.`});
  }

};

module.exports = {
  uploadFile
};