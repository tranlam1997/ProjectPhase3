const Ajv = require('ajv')
const ajv = new Ajv({allErrors: true}) 
const addFormats = require('ajv-formats');
addFormats(ajv);
const schemas = require('../schema');


exports.validate_user = ajv.compile(schemas.userSchema);
exports.validate_form = ajv.compile(schemas.formSchema)