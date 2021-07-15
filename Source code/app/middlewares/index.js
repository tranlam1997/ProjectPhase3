const {authenticateJwt} = require("./authentication");
const {checkDuplicateUser} = require("./duplicate_user_checking");
const validateData = require('./data_validation');
const {deleteFile} = require('./file_deletion');
const checkPermission = require('./authorization');
const {checkFormExpiration} = require('./form_expiration_checking');
const {checkLogIn} = require('./log_in_checking');
const {uploadFile} = require('./file_uploading');
const checkRole = require('./role_checking');

module.exports = {
  authenticateJwt,
  checkDuplicateUser,
  validateData,
  deleteFile,
  checkPermission,
  checkFormExpiration,
  checkLogIn,
  uploadFile,
  checkRole
};