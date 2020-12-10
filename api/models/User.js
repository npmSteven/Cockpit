const { DataTypes } = require('sequelize');

const { sequelize } = require('../db');

module.exports.User = sequelize.define('user', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  isAdmin: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
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
