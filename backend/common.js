const bcrypt = require('bcryptjs');
const { DateTime } = require('luxon');

module.exports.respondError = (message) => {
  return {
    success: false,
    payload: {
      message,
    },
  };
};

module.exports.respondSuccess = (payload) => {
  return {
    success: true,
    payload,
  };
};

module.exports.respondSuccessMsg = (message) => {
  return {
    success: true,
    payload: {
      message,
    },
  };
};

module.exports.sanitiseUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  };
};

module.exports.getCurrentTimestamp = () => Math.floor(Date.now() / 1000);

module.exports.generateHash = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
};

module.exports.extractExpiresFromCookieToTimestamp = (cookie) => {
  const expiryDate = cookie
    .split(';')
    .find((item) => item.includes('Expires'))
    .trim()
    .replace('Expires=', '');
  const dt = DateTime.fromHTTP(expiryDate).toJSDate();
  return new Date(dt).getTime() / 1000;
};

module.exports.extractVideoDetails = (video) => {
  return {
    channelId: video.creator.id,
    videoId: video.videoAttachments[0],
    title: this.cleanTitle(video.title),
    thumbnail: video.thumbnail.path,
    releaseDate: `${Math.floor(new Date(video.releaseDate).getTime() / 1000)}`,
  };
};

module.exports.throttle = (func, limit) => {
  let inThrottle
  return function() {
    const args = arguments
    const context = this
    if (!inThrottle) {
      func.apply(context, args)
      inThrottle = true
      setTimeout(() => inThrottle = false, limit)
    }
  }
};

module.exports.cleanTitle = (title) => {
  const titleWithoutSemicolon = title.replace(':', '');
  const titleWithoutForwardSlash = titleWithoutSemicolon.replace('/', '');
  const titleWithoutBackSlash = titleWithoutForwardSlash.replace('\\', '');
  return titleWithoutBackSlash;
};
