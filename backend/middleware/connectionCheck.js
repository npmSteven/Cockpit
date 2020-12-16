const { respondError, getCurrentTimestamp } = require("../common");
const { FloatplaneCredential } = require("../models/FloatplaneCredential");
const { User } = require("../models/User");

module.exports.connectionCheck = async (req, res, next) => {
  const userId = req.user.id;

  try {
    // Check if the token has a valid user
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json(respondError('User does not exist'));
  
    // Check if the user has setup a connection
    const floatplaneCredential = await FloatplaneCredential.findOne({ where: { userId } });
    if (!floatplaneCredential || !floatplaneCredential.cookie) return res.status(404).json(respondError('Floatplane not connected'));

    // Check if cookie has expired
    const currentTimestamp = getCurrentTimestamp();
    if (currentTimestamp >= floatplaneCredential.cookieExpires) {
      await floatplaneCredential.destroy();
      return res.status(403).json(respondError('Your cookie has expired relog'));
    }

    req.cookie = floatplaneCredential.cookie;
    next();
  } catch (error) {
    console.error('ERROR - connectionCheck():', error);
  }
};
