const jsonwebtoken = require('jsonwebtoken');

const { respondError } = require('../common');
const { User } = require('../models/User');
const { jwt } = require('../config');

module.exports.authCheck = async (req, res, next) => {
  // Get token from headers
  const token = req.header('Authorization');

  // Valided that the user gave us a token
  if (!token) {
    return res.status(401).json(respondError('Token not provided'));
  }
  
  // Verify token
  const decoded = jsonwebtoken.verify(token, jwt.secret);

  try {
    const user = User.findByPk(decoded.id);
    if (!user) {
      return res.status(404).json(respondError('User does not exist'));
    }

    req.user = decoded;

    next();
  } catch (error) {
    console.error('ERROR - authCheck():', error);
  }
};
