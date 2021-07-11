const router = require('express').Router();
const controller = require('../controllers');
const middlewares = require('../middlewares');

module.exports = (app) => {
    require('./user_routes')(router, controller, middlewares);
    require('./form_routes')(router,controller,middlewares);
    require('./report_routes')(router,controller,middlewares);
    app.use('/hrms/user', middlewares.authenticateJwt);  // Check if user has logged in
    app.use('/hrms', router);
    
}