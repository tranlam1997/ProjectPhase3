const {generateAccessToken} = require('./generate_access_token');
const {randomNum} = require('./generate_random_num');
const {findForm} = require('./find_form');
const {createPermission} = require('./create_permission');
const {checkFormCategory} = require('./check_form_category');

module.exports = {
    generateAccessToken,
    randomNum,
    findForm,
    createPermission,
    checkFormCategory
}