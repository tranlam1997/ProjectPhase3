const {generateAccessToken} = require('./generate_access_token');
const {randomNum} = require('./generate_random_num');
const {createPermission} = require('./create_permission');
const {checkFormCategory} = require('./check_form_category');
const {getPagination} = require('./get_pagination');

module.exports = {
    generateAccessToken,
    randomNum,
    createPermission,
    checkFormCategory,
    getPagination
}