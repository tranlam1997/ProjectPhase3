const url = '/user'
const { authenticateJwt } = require('./auth_token');

const checkPath = (req, res, next) => {
    if (!req.originalUrl.includes(url)) return next();
    authenticateJwt(req, res, next);
}

module.exports = {
    checkPath
}