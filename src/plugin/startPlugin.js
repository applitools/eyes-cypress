'use strict';

const makeStartServer = require('./server');
const makePluginExport = require('./pluginExport');
const {startApp} = require('./app');
const {
  makeVisualGridClient,
  makeGetConfig,
  createLogger,
} = require('@applitools/visual-grid-client');
const makeHandlers = require('./handlers');
const getConfig = makeGetConfig();
const config = getConfig();
const logger = createLogger(config.showLogs);
const handlers = makeHandlers({
  logger,
  config,
  makeVisualGridClient,
});
const app = startApp({handlers, logger});
const startServer = makeStartServer({app, logger});

module.exports = makePluginExport(startServer);
