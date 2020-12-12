const Joi = require('joi');

module.exports.username = Joi.string().alphanum().min(2).max(255).lowercase().required();

module.exports.password = Joi.string().alphanum().min(6).max(255).required();

module.exports.thirdPartyPassword = Joi.string().alphanum().required();

module.exports.token = Joi.string().required();
