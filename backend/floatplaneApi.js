const { get, post } = require("./api");

const floatplaneDomain = 'https://www.floatplane.com/api';

module.exports.floatplaneDomain = floatplaneDomain;

module.exports.getChannels = async (cookie) => {
  try {
    const channels = await get({ url: `${floatplaneDomain}/v2/user/subscriptions`, headers: { cookie } });
    if (!channels) return null;
    return channels;
  } catch (error) {
    console.error('ERROR - getChannels():', error);
    return null;
  }
}

module.exports.login = async (username, password) => {
  try {
    const login = await post({ url: `${floatplaneDomain}/v2/auth/login`, body: { username, password }});
    if (!login) return null;
    return login;
  } catch (error) {
    console.error('ERROR - login():', error);
    return null;
  }
}

module.exports.token2fa = async (token, cookie2fa) => {
  try {
    const login = await post({ url: `${floatplaneDomain}/v2/auth/checkFor2faLogin`, headers: { 'Cookie': cookie2fa }, body: { token } });
    if (!login) return null;
    return login;
  } catch (error) {
    console.error('ERROR - token():', error);
    return null;
  }
}
