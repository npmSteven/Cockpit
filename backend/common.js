const bcrypt = require('bcryptjs');

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
    }
  };
};

module.exports.sanitiseUser = (user) => {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt,
  };
};

module.exports.getCurrentTimestamp = () => Date.now();

module.exports.generateHash = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
};

module.exports.extractExpiresFromCookie = (cookie) => {
  const expiryDate = cookie.split(";").find(item => item.includes('Expires')).trim().replace('Expires=', '');
  
}
