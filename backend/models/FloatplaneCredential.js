const { DataTypes } = require('sequelize');

const { sequelize } = require('../db');

module.exports.FloatplaneCredential = sequelize.define('floatplaneCredential', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id',
    },
  },
  floatplaneUserId: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  floatplaneUserImage: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  cookieExpires: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  cookie: {
    type: DataTypes.STRING(1000),
  },
  cookie2fa: {
    type: DataTypes.STRING(1000),
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { createdAt: false, updatedAt: false });
