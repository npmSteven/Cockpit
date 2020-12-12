const Joi = require('joi');

const { token } = require('./commonValidation');

module.exports.floatplaneTokenValidation = Joi.object({
  token,
});
