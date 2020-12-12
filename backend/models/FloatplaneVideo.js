const { DataTypes } = require('sequelize');

const { sequelize } = require('../db');

module.exports.FloatplaneVideo = sequelize.define('FloatplaneVideo', {
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  channelId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  videoId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  downloadProgress: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  downloadStatus: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { createdAt: false, updatedAt: false });
