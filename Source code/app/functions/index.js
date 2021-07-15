const {generateAccessToken} = require('./generate_access_token');
const {randomNum} = require('./generate_random_num');
const {setPermission} = require('./set_permission');
const {checkFormCategory} = require('./check_form_category');
const {checkResource} = require('./check_resource');
const {getPagination} = require('./get_pagination');
const {getRoles} = require('./get_role')

module.exports = {
    generateAccessToken,
    randomNum,
    setPermission,
    checkFormCategory,
    checkResource,
    getPagination,
    getRoles
}