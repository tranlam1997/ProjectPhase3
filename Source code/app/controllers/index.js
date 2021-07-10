const db = require('../models');
const user = db.user;
const form = db.form
const userInfor = db.userInfor;
const Op = db.Sequelize.Op;


exports.user = require('./user.controller')(user,userInfor);
exports.form = require('./form.controller')(form,user,userInfor,Op);
exports.report = require('./report.controller')(form,user,userInfor,Op);
exports.upload = require('./file.controller');
