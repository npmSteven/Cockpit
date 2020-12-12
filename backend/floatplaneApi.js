const { get } = require("./api");

const floatplaneDomain = 'https://www.floatplane.com/api';

module.exports.floatplaneDomain = floatplaneDomain;

module.exports.getChannels = async (cookie) => {
  try {
    const channels = await get(`${floatplaneDomain}/v2/user/subscriptions`, { cookie });
    if (!channels) return null;
    return channels;
  } catch (error) {
    console.error('ERROR - getChannels():', error);
    return null;
  }
}
