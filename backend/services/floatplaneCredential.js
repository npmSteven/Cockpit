const { v4 } = require("uuid");
const { getCurrentTimestamp, extractExpiresFromCookieToTimestamp } = require("../common");
const { FloatplaneCredential } = require("../models/FloatplaneCredential");

module.exports.getOrCreateFloatplaneCredential = async (userId) => {
  try {
    const floatplaneCredential = await FloatplaneCredential.findOne({ where: { userId } });
    if (floatplaneCredential) return floatplaneCredential;
    const currentDateTime = getCurrentTimestamp();
    return FloatplaneCredential.create({
      id: v4(),
      userId,
      createdAt: currentDateTime,
    });
  } catch (error) {
    console.error('ERROR - getOrCreateFloatplaneCredential():', error);
    return null;
  }
}

module.exports.updateFloatplaneCredential = async (userId, payload) => {
  try {
    const floatplaneCredential = await this.getOrCreateFloatplaneCredential(userId);
    if (payload.needs2FA) {
      return floatplaneCredential.update({
        floatplaneUserId: null,
        floatplaneUserImage: null,
        cookie2fa: payload.cookie,
        cookieExpires: null,
        cookie: null,
      });
    }
    // Get expiry from cookie
    const cookieExpires = extractExpiresFromCookieToTimestamp(payload.cookie);
    return floatplaneCredential.update({
      floatplaneUserId: payload.user.id,
      floatplaneUserImage: payload.user.profileImage.path,
      cookieExpires,
      cookie2fa: null,
      cookie: payload.cookie,
    });
  } catch (error) {
    console.error('ERROR - updateFloatplaneCredential():', error);
    return null;
  }
}
