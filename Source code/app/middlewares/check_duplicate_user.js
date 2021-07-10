const db = require('../models');
const User = db.user;
const Role = db.role;

const checkDuplicateUser = (req, res, next) => {
  // Check duplicate username
  User.findOne({
    where: {
      userName: req.body.userName
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: 'Failed! Username is already in use!'
      });
      return;
    }

    // Check duplicate email
    User.findOne({
      where: {
        email: req.body.email
      }
    }).then(user => {
      if (user) {
        res.status(400).send({
          message: 'Failed! Email is already in use!'
        });
        return;
      }

      next();
    });
  });
};



module.exports = {
  checkDuplicateUser
};