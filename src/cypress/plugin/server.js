'use strict';
const {promisify: p} = require('util');
const psetTimeout = p(setTimeout);
const {openEyes, createLogger} = require('@applitools/rendering-grid-client');
const logger = createLogger();
const makeHandlers = require('./handlers');
const handlers = makeHandlers(openEyes);
const {startApp} = require('./app');

let eyesPort = require('./defaultPort');
let server;
const app = startApp(handlers, logger);

async function getEyesPort() {
  let port;

  // TODO can server.address() be undefined or null?
  while (!server || !server.address() || !(port = server.address().port)) {
    await psetTimeout(10);
  }

  logger.log(`getEyesPort port=${port}`);
  return port;
}

async function closeEyes() {
  if (server) {
    await new Promise((resolve, reject) => server.close(err => (err ? reject(err) : resolve())));
  }
  server = null;
}

function moduleExports({port = eyesPort} = {}) {
  eyesPort = port;
  return {
    getEyesPort,
    closeEyes,
  };
}

// start server after process tick (or as microtask) to allow user to set custom port
Promise.resolve()
  .then(() => {
    logger.log(`starting plugin at port ${eyesPort}`);
    server = app.listen(eyesPort, () => {
      logger.log(`server running at port: ${server.address().port}`);
    });

    server.on('error', err => {
      if (err.code === 'EADDRINUSE') {
        logger.log(
          `error: plugin server could not start at port ${eyesPort}: port is already in use.`,
        );
      } else {
        logger.log('error in plugin server:', err);
      }
    });
  })
  .catch(err => {
    logger.log('error during server start', err);
  });

moduleExports.getEyesPort = getEyesPort;
moduleExports.closeEyes = closeEyes;

module.exports = moduleExports;
