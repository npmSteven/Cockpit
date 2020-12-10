const Joi = require('joi');

const { username, password } = require('./commonValidation');

module.exports.authValidation = Joi.object({
  username,
  password,
});
