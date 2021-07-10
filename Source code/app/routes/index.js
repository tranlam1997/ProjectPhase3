const router = require('express').Router();
const controller = require('../controllers');
const middlewares = require('../middlewares');

module.exports = (app) => {
    require('./user_routes')(router, controller, middlewares);
    require('./form_routes')(router,controller,middlewares);
    require('./report_routes')(router,controller);
    app.use('/report',middlewares.checkRole.isHr);
    app.use('/hrms', router);
}