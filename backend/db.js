const { Sequelize } = require('sequelize');

const { db } = require('./config');

const sequelize = new Sequelize(db.url, {
  protocol: 'postgres',
  logging: false,
});

module.exports.sequelize = sequelize;

module.exports.connectDb = async () => {
  await sequelize.authenticate();
  console.log('Connected to DB');
};

// Models
const { User } = require('./models/User');
const { FloatplaneCredential } = require('./models/FloatplaneCredential');
const {
  FloatplaneChannelSetting,
} = require('./models/FloatplaneChannelSetting');
const { FloatplaneVideo } = require('./models/FloatplaneVideo');

module.exports.syncDb = async () => {
  try {
    await User.sync();
    await FloatplaneCredential.sync();
    await FloatplaneChannelSetting.sync();
    await FloatplaneVideo.sync();
    console.log('Synced all of the models');
  } catch (error) {
    console.error('ERROR - syncDb():', error);
  }
};
