const userSchema = {
  type: 'object',
  properties: {
    firstName: {type: 'string'},
    lastName: {type: 'string'},
    userName: {type: 'string'},
    password: {type: 'string', maxLength : 16, minLength: 6, format: 'password'},
    email: {type: 'string', format: 'email'},
  },
  required: ['firstName','lastName','userName','password','email'],
  additionalProperties: true
}

module.exports = {
  userSchema
};