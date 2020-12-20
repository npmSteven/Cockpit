const { DataTypes } = require('sequelize');

const { sequelize } = require('../db');

module.exports.FloatplaneVideo = sequelize.define(
  'floatplaneVideo',
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
    channelId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    videoId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    thumbnail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    releaseDate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    downloadProgress: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    downloadStatus: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'download',
    },
    createdAt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { createdAt: false, updatedAt: false }
);
