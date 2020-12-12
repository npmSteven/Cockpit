const { Sequelize } = require('sequelize');

const { db } = require('./config');

const sequelize = new Sequelize(db.url, { protocol: 'postgres', logging: false });

module.exports.sequelize = sequelize;

module.exports.connectDb = () => sequelize.authenticate();

// Models
const { User } = require('./models/User');
const { FloatplaneCredential } = require('./models/FloatplaneCredential');
const { FloatplaneChannelSetting } = require('./models/FloatplaneChannelSetting');

module.exports.syncDb = async () => {
  try {
    await User.sync();
    await FloatplaneCredential.sync();
    await FloatplaneChannelSetting.sync();
  } catch (error) {
    console.error('ERROR - syncDb():', error);
  }
}