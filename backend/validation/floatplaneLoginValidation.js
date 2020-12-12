const Joi = require('joi');

const { username, thirdPartyPassword } = require('./commonValidation');

module.exports.floatplaneLoginValidation = Joi.object({
  username,
  password: thirdPartyPassword,
});
