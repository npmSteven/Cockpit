const { DataTypes } = require('sequelize');

const { sequelize } = require('../db');

module.exports.FloatplaneChannelSetting = sequelize.define(
  'floatplaneChannelSetting',
  {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isSubscribed: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    channelId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    directoryName: {
      type: DataTypes.STRING,
      defaultValue: null,
    },
    automaticallyDownload: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    automaticallyDownloadTimestamp: {
      type: DataTypes.BIGINT,
      defaultValue: null,
    },
    downloadQuality: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "1080",
    },
    createdAt: {
      type: DataTypes.BIGINT,
      allowNull: false,
    },
  },
  { createdAt: false, updatedAt: false }
);
