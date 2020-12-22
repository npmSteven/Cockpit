const { DataTypes } = require('sequelize');

const { sequelize } = require('../db');

module.exports.User = sequelize.define(
  'user',
  {
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
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  { createdAt: false, updatedAt: false }
);
