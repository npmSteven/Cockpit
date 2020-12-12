const { DataTypes } = require('sequelize');

const { sequelize } = require('../db');

module.exports.FloatplaneChannelSetting = sequelize.define('floatplaneChannelSetting', {
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
  directoryName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  automaticallyDownload: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  downloadQuality: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1080,
  },
  createdAt: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, { createdAt: false, updatedAt: false });
