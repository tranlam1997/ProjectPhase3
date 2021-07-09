const router = require('express').Router();
const controller = require('../controllers');
const middlewares = require('../middlewares');

module.exports = (app) => {
    require('./user')(router, controller, middlewares);
    require('./file')(router);
    require('./form')(router,controller,middlewares);
    require('./report')(router,controller,middlewares);
    app.use('/hrms', router);
}