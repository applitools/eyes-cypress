'use strict';

const makeStartServer = require('./server');
const makePluginExport = require('./pluginExport');
const {startApp} = require('./app');
const {
  makeVisualGridClient,
  makeGetConfig,
  createLogger,
} = require('@applitools/visual-grid-client');
const getErrorsAndDiffs = require('./getErrorsAndDiffs');
const makeHandlers = require('./handlers');
const getConfig = makeGetConfig();
const config = Object.assign({concurrency: 1}, getConfig());
const logger = createLogger(config.showLogs);
const handlers = makeHandlers({
  logger,
  config,
  makeVisualGridClient,
  getErrorsAndDiffs,
});
const app = startApp({handlers, logger});
const startServer = makeStartServer({app, logger});

logger.log('eyes.cypress plugin running with config:', config);

module.exports = makePluginExport(startServer);
