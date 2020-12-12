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
    updatedAt: user.updatedAt,
  };
};

module.exports.getCurrentDateTime = () => `${new Date()}`;

module.exports.generateHash = async (password) => {
  try {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  } catch (error) {
    throw error;
  }
};
