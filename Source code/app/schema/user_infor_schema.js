const userInforSchema = {
    type: 'object',
    properties: {
      phone: {type: 'string', maxLength: 12, minLength: 9},
      idCard: {type: 'string', maxLength: 12, minLength: 9},
      socialInsurance: {type: 'string'},
      address: {type: 'string'}
    },
    additionalProperties: true
  }
  
  module.exports = {
    userInforSchema
  };