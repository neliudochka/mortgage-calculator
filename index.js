'use strict';

const dbLoginSettings = require('./config/dbLoginSettings.config.json');
const { Server } = require('./nodeJs/server.js');
const { Database } = require('./nodeJs/database.js');

const database = new Database(dbLoginSettings);
const server = new Server(process.env.PORT || 8080, database);