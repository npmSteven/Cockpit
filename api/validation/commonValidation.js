const Joi = require('joi');

module.exports.username = Joi.string().alphanum().min(2).max(50).lowercase().required();

module.exports.password = Joi.string().alphanum().min(8).max(255).required();
