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
  },
  floatplaneUserId: {
    type: DataTypes.STRING,
  },
  floatplaneUserImage: {
    type: DataTypes.STRING,
  },
  cookie: {
    type: DataTypes.STRING(1000),
  },
  cookie2fa: {
    type: DataTypes.STRING(1000),
  },
  createdAt: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.STRING,
  },
}, { createdAt: false, updatedAt: false });
