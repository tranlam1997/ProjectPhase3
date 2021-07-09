const db = require('../models');
const user = db.user;
const form = db.form
const userInfor = db.userInfor;
const Op = db.Sequelize.Op;


exports.user = require('./user.controller')(user);
exports.permission = require('./permission.controller');
exports.assessmentForm = require('./form.controller')(form,user,userInfor,"assessment",Op);
exports.probationaryForm = require('./form.controller')(form,user,userInfor,"probationary",Op);
exports.reportProbationaryForm = require('./report.controller')(form,user,userInfor,"probationary",Op);
exports.reportAssessmentForm = require('./report.controller')(form,user,userInfor,"assessment",Op);
