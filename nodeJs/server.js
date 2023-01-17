"use strict";

const http = require("http");
const handleRequest = require("./router");

class Server {
  constructor(port) {
    this.server = http.createServer();
    this.server.listen(port, () =>
      console.log(`Server listening on port ${port}...`)
    );
    this.server.on("request", (req, res) => handleRequest(req, res));
  }
}

module.exports = { Server };
