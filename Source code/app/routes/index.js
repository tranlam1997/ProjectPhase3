const api = require('express').Router();
const controller = require('../controllers');
const middlewares = require('../middlewares');

module.exports = (app) => {
    require('./user_apis')(api, controller, middlewares);
    require('./form_apis')(api, controller, middlewares);
    require('./report_apis')(api, controller, middlewares);
    app.use('/hrms/user', middlewares.authenticateJwt);  // Check if user has logged in
    app.use('/hrms', api);
    
}