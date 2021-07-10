const {authenticateJwt} = require("./auth_token");
const {checkDuplicateUser} = require("./check_duplicate_user");
const {getAccessToken} = require('./get_access_token');
const validateData = require('./validate_data');
const {checkPath} = require('./check_path');
const {deleteFile} = require('./delete_file');
const checkRole = require('./check_role');
const {checkFormExpiration} = require('./check_form_expiration');
const {checkLogIn} = require('./check_log_in');
const {setPermission} = require('./set_permission');
const {uploadFile} = require('./upload_file');

module.exports = {
  authenticateJwt,
  checkDuplicateUser,
  getAccessToken,
  validateData,
  checkPath,
  deleteFile,
  checkRole,
  checkFormExpiration,
  checkLogIn,
  setPermission,
  uploadFile
};