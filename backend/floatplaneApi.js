const { get, post } = require("./api");
const { extractVideoDetails } = require("./common");

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
};

module.exports.login = async (username, password) => {
  try {
    const login = await post({ url: `${floatplaneDomain}/v2/auth/login`, body: { username, password }});
    if (!login) return null;
    return login;
  } catch (error) {
    console.error('ERROR - login():', error);
    return null;
  }
};

module.exports.token2fa = async (token, cookie2fa) => {
  try {
    const login = await post({ url: `${floatplaneDomain}/v2/auth/checkFor2faLogin`, headers: { 'Cookie': cookie2fa }, body: { token } });
    if (!login) return null;
    return login;
  } catch (error) {
    console.error('ERROR - token2fa():', error);
    return null;
  }
};

module.exports.getVideos = async (channelId, cookie) => {
  try {
    const payload = await get({ url: `${floatplaneDomain}/v3/content/creator/list?ids=${channelId}`, headers: { cookie } });
    if (!payload) return null;
    // Get videos from blogPosts
    const videos = payload.blogPosts.filter(blogPost => blogPost.metadata.hasVideo);
    const minifiedVideos = videos.map(video => extractVideoDetails(video));
    return minifiedVideos;
  } catch (error) {
    console.error('ERROR - getVideos():', error);
    return null;
  }
};
