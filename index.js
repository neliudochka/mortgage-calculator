"use strict";

const dbLoginSettings = require("./config/dbLoginSettings.config.json");
const { PORT } = require("./config/port.js");
const { Server } = require("./nodeJs/server.js");
const { Database } = require("./nodeJs/database.js");

const database = new Database(dbLoginSettings);
const server = new Server(PORT, database);
