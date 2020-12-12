const { get } = require("../api");
const { respondError } = require("../common");
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
  
    // Check if the cookie is still valid
    const payload = await get('https://www.floatplane.com/api/v2/user/subscriptions', { cookie: floatplaneCredential.cookie }, res);
    if (!payload) {
      await floatplaneCredential.update({
        floatplaneUserId: null,
        floatplaneUserImage: null,
        cookie: null,
        cookie2fa: null,
      });
      return res.status(401).json(respondError('Floatplane connection is no longer valid, setup connection again'));
    }

    next();
  } catch (error) {
    console.error('ERROR - connectionCheck():', error);
  }
};
