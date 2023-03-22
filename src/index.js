require("dotenv").config();
const logger = require("./utils/logger");
const app = require("./app");
const http = require("http");
const server = http.Server(app);
const packageInfo = require("../package.json");

server.listen(process.env.SERVER_PORT_PROD, (error) => {
  if (error) {
    logger.error(`Error: ${error}`);
    process.exit(1);
  }
  logger.debug(`[Phenikaa] Version: *** ${packageInfo.version} ***`);
  logger.debug(
    `[Phenikaa] Server is listening on port: ${process.env.SERVER_PORT_PROD}`
  );
});
