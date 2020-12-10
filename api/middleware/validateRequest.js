const { respondError } = require("../common");
const { authValidation } = require("../validation/authValidation");
const { floatplaneLoginValidation } = require("../validation/floatplaneLoginValidation");
const { floatplaneTokenValidation } = require("../validation/floatplaneTokenValidation");

module.exports.validateAuthRequest = (req, res, next) => {
  const { error, value } = authValidation.validate(req.body);
  if (error) {
    return res.status(400).json(respondError(error.details[0].message))
  }
  req.value = value;
  next();
}

module.exports.validateFloatplaneLoginRequest = (req, res, next) => {
  const { error, value } = floatplaneLoginValidation.validate(req.body);
  if (error) {
    return res.status(400).json(respondError(error.details[0].message))
  }
  req.value = value;
  next();
}

module.exports.validateFloatplaneTokenRequest = (req, res, next) => {
  const { error, value } = floatplaneTokenValidation.validate(req.body);
  if (error) {
    return res.status(400).json(respondError(error.details[0].message))
  }
  req.value = value;
  next();
}
