"use strict";

const { PORT } = require("./config/port.js");
const { Server } = require("./nodeJs/server.js");

const server = new Server(PORT);
