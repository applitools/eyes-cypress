'use strict';
const {promisify: p} = require('util');
const psetTimeout = p(setTimeout);
const {
  makeRenderingGridClient,
  initConfig,
  createLogger,
} = require('@applitools/rendering-grid-client');
const logger = createLogger(process.env.APPLITOOLS_SHOW_LOGS); // TODO when switching to DEBUG sometime remove this env var
const {startApp} = require('./app');
const makeHandlers = require('./handlers');
const {getConfig, updateConfig, getInitialConfig} = initConfig(process.cwd());
const handlers = makeHandlers({
  logger,
  makeRenderingGridClient: () =>
    makeRenderingGridClient({
      getConfig,
      updateConfig,
      getInitialConfig,
      showLogs: process.env.APPLITOOLS_SHOW_LOGS, // TODO when switching to DEBUG sometime remove this env var
    }),
});
const makePluginExport = require('./pluginExport');

const pluginExport = makePluginExport({
  getEyesPort,
  closeEyes,
});

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

// start server after process tick (or as microtask) to allow user to set custom port
Promise.resolve()
  .then(() => {
    logger.log(`starting plugin server`);
    server = app.listen(0, () => {
      logger.log(`plugin server running at port: ${server.address().port}`);
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
    });
  })
  .catch(err => {
    logger.log('error during server start', err);
  });

function moduleExports() {
  return pluginExport.apply(this, arguments);
}
moduleExports.getEyesPort = getEyesPort;
moduleExports.closeEyes = closeEyes;

module.exports = moduleExports;
