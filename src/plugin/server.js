'use strict';
const {
  makeVisualGridClient,
  makeGetConfig,
  createLogger,
} = require('@applitools/visual-grid-client');
const {startApp} = require('./app');
const makeHandlers = require('./handlers');
const getConfig = makeGetConfig();
const config = getConfig();
const logger = createLogger(config.showLogs);
const handlers = makeHandlers({
  logger,
  config,
  makeVisualGridClient,
});

const app = startApp(handlers, logger);

function startServer() {
  return new Promise((resolve, reject) => {
    logger.log(`starting plugin server`);
    const server = app.listen(0, err => {
      if (err) {
        logger.log('error starting plugin server', err);
        reject(err);
      } else {
        logger.log(`plugin server running at port: ${server.address().port}`);
        resolve({
          eyesPort: server.address().port,
          closeServer: server.close.bind(server),
        });
      }
    });

    server.on('error', err => {
      if (err.code === 'EADDRINUSE') {
        logger.log(
          `error: plugin server could not start at port ${
            server.address().port
          }: port is already in use.`,
        );
      } else {
        logger.log('error in plugin server:', err);
      }
      reject(err);
    });
  });
}

module.exports = {startServer};
