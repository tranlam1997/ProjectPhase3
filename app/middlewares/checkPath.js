const url = "/user"
const {authJwt} = require("./authToken");

const checkPath = (req,res,next) => {
    if(!req.originalUrl.includes(url)) return next();
    authJwt(req,res,next);
}

module.exports = {
    checkPath
}