require('dotenv').config();
const logger = require('./utils/logger');
const app = require('./app');
const http = require('http');
const server = http.Server(app);
const { Server } = require('socket.io');
const io = new Server(server);
const path = require('path');
const packageInfo = require('../package.json');

global.io = io;

server.listen(process.env.SERVER_PORT_PROD, (error) => {
  if (error) {
    logger.error(`Error: ${error}`);
    process.exit(1);
  }
  logger.debug(`[Phenikaa] Version: *** ${packageInfo.version} ***`);
  logger.debug(`[Phenikaa] Server is listening on port: ${process.env.SERVER_PORT_PROD}`);
  logger.debug(`[Phenikaa] Socket.io is listening on port: ${process.env.SERVER_PORT_PROD}`);
});

module.exports = { io };
