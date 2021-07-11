const formSchema = {
  type: 'object',
  properties: {
    unit: {type: 'string'},
    position: {type: 'string'},
    content: {type: 'string',  minLength: 20},
    result: {type: 'string',  minLength: 20},
    proposal: {type: 'string'},
  },
  required: ['unit','position','content','result'],
  additionalProperties: true
}

module.exports = {
  formSchema
};