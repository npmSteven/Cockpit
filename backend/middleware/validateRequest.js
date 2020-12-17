const { respondError } = require("../common");
const { authValidation } = require("../validation/authValidation");
const { channelValidation, channelValidationSettings, channelValidationSettingsUpdate } = require("../validation/channelValidation");
const { floatplaneLoginValidation } = require("../validation/floatplaneLoginValidation");
const { floatplaneTokenValidation } = require("../validation/floatplaneTokenValidation");

module.exports.validateAuthRequest = (req, res, next) => {
  const { error, value } = authValidation.validate(req.body);
  if (error) {
    return res.status(400).json(respondError(error.details[0].message))
  }
  req.value = value;
  next();
};

module.exports.validateFloatplaneLoginRequest = (req, res, next) => {
  const { error, value } = floatplaneLoginValidation.validate(req.body);
  if (error) {
    return res.status(400).json(respondError(error.details[0].message))
  }
  req.value = value;
  next();
};

module.exports.validateFloatplaneTokenRequest = (req, res, next) => {
  const { error, value } = floatplaneTokenValidation.validate(req.body);
  if (error) {
    return res.status(400).json(respondError(error.details[0].message))
  }
  req.value = value;
  next();
};

module.exports.validateChannelSettingsRequest = (req, res, next) => {
  const { error, value } = channelValidationSettings.validate(req.params);
  if (error) {
    return res.status(400).json(respondError(error.details[0].message))
  }
  req.value = value;
  next();
};

module.exports.validateChannelSettingsUpdateRequest = (req, res, next) => {
  const { error, value } = channelValidationSettingsUpdate.validate({ ...req.params, ...req.body });
  if (error) {
    return res.status(400).json(respondError(error.details[0].message))
  }
  req.value = value;
  next();
};
