// Packages
const express = require('express');
const cors = require('cors');

// Module imports
const { server } = require('./config');
const { connectDb, syncDb } = require('./db');
const { syncDownloadVideos } = require('./video');

// Init express
const app = express();

// Cors
app.use(cors());

// Middleware for parsing the body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const init = async () => {
  try {
    // Connect to DB
    await connectDb();

    // Sync DB
    await syncDb();

    // Routes v1
    const apiV1 = '/api/v1';
    app.use(`${apiV1}/auth`, require('./routes/api/authRoutes'));
    app.use(`${apiV1}/connection`, require('./routes/api/connectionRoutes'));
    app.use(`${apiV1}/channels`, require('./routes/api/channelRoutes'));

    // Listen for requests
    app.listen(server.port, () => console.log(`Server ready!`));

    // Download/Sync videos
    await syncDownloadVideos();
    setInterval(async () => {
      await syncDownloadVideos();
    }, 150000); // 2.5 minutes
  } catch (error) {
    console.error('ERROR - init():', error);
  }
};

init();
