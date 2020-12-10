const { Sequelize } = require('sequelize');

const { db } = require('./config');

const sequelize = new Sequelize(db.url, { protocol: 'postgres', logging: false });

module.exports.sequelize = sequelize;

module.exports.connectDb = () => sequelize.authenticate();

// Models
const { User } = require('./models/User');

module.exports.syncDb = async () => {
  try {
    await User.sync();
  } catch (error) {
    console.error('ERROR - syncDb():', error);
  }
}