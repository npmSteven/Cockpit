const Joi = require('joi');

module.exports.username = Joi.string().alphanum().min(2).max(255).lowercase().required();

module.exports.password = Joi.string().alphanum().min(6).max(255).required();

module.exports.thirdPartyPassword = Joi.string().alphanum().required();

module.exports.token = Joi.string().required();

module.exports.channelId = Joi.string().required();

module.exports.directoryName = Joi.required();

module.exports.automaticallyDownload = Joi.boolean().required();

module.exports.downloadQuality = Joi.valid('360', '480', '720', '1080', '2160').required();
