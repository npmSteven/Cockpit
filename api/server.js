// Packages
const express = require('express');
const cors = require('cors');

// Module imports
const { server } = require('./config');
const { connectDb, syncDb } = require('./db');

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
    const apiv1 = '/api/v1';
    app.use(`${apiv1}/auth`, require('./routes/api/authRoutes').authRoutes);

    // Listen for requests
    app.listen(server.port, () => console.log(`Server listening on ${server.port}`));
  } catch (error) {
    console.error('ERROR - init():', error);
  }
}

init();
