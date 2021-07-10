const {
    validate_user,
    validate_form
} = require('../validator');

const validateUser = (req, res, next) => {
    const valid = validate_user(req.body);
    if (!valid) return res.send({ error: validate_user.errors[0] });
    next();
}

const validateForm = (req, res, next) => {
    const valid = validate_form(req.body);
    if (!valid) return res.send({ error : validate_form.errors[0] });
    next();
}


module.exports = {
    validateUser,
    validateForm
}