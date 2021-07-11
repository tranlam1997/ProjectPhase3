const {
    validate_user,
    validate_userInfor,
    validate_form
} = require('../validator');

const validateUser = (req, res, next) => {
    const valid = validate_user(req.body);
    if (!valid) return res.send({ error: validate_user.errors[0] });
    next();
}


const validateUserInfor = (req, res, next) => {
    const valid = validate_userInfor(req.body);
    if (!valid) return res.send({ error: validate_userInfor.errors[0] });
    next();
}


const validateForm = (req, res, next) => {
    const valid = validate_form(req.body);
    if (!valid) return res.send({ error : validate_form.errors[0] });
    next();
}


module.exports = {
    validateUser,
    validateUserInfor,
    validateForm
}