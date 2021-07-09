const {
    validate_user
} = require("../validator");

const validateUser = (req, res, next) => {
    const valid = validate_user(req.body);
    if (!valid) return res.send(validate_user.errors[0]);
    next();
}


module.exports = {
    validateUser
}