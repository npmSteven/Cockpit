const Joi = require('joi');

const { channelId, directoryName, automaticallyDownload, downloadQuality } = require('./commonValidation');

module.exports.channelValidationChannelId = Joi.object({
  channelId,
});

module.exports.channelValidationSettingsUpdate = Joi.object({
  channelId,
  directoryName,
  automaticallyDownload,
  downloadQuality,
});
