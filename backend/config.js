require('dotenv').config();

module.exports = {
  server: {
    port: process.env.PORT || 8080,
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};
