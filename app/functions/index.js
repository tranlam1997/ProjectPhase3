const {checkPass} = require('./checkPass');
const {classifyRole} = require('./classifyRole');
const {generateAccessToken} = require('./generateAccessToken');
const {initialRole,initialPermission} = require('./initializeRole');
const {randomNum} = require('./generateRandomNum');
const {findForm} = require('./findForm');

module.exports = {
    checkPass,
    classifyRole,
    generateAccessToken,
    initialRole,
    initialPermission,
    randomNum,
    findForm
}