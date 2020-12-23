module.exports = {
  server: {
    port: process.env.PORT,
  },
  db: {
    url: process.env.DATABASE_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
  },
};
