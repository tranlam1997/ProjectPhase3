const db = require('../models');
const user = db.user;
const form = db.form;
const role = db.role;
const permission = db.permission;
const userInfor = db.userInfor;
const Op = db.Sequelize.Op;


exports.user = require('./user_controller')(user, userInfor, form, permission, role);
exports.form = require('./form_controller')(form, user, userInfor, Op);
exports.report = require('./report_controller')(form, user, Op);
exports.upload = require('./file_controller');
