const { respondError } = require("../common");
const { authValidation } = require("../validation/authValidation")

module.exports.validateAuthRequest = (req, res, next) => {
  const { error, value } = authValidation.validate(req.body);
  if (error) {
    return res.status(400).json(respondError(error.details[0].message))
  }
  req.value = value;
  next();
}
