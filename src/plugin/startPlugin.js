'use strict';

const {version: packageVersion} = require('../../package.json');
const agentId = `eyes.cypress/${packageVersion}`;
const makeStartServer = require('./server');
const makePluginExport = require('./pluginExport');
const {startApp} = require('./app');
const {
  makeVisualGridClient,
  makeGetConfig,
  createLogger,
} = require('@applitools/visual-grid-client');
const getErrorsAndDiffs = require('./getErrorsAndDiffs');
const processCloseAndAbort = require('./processCloseAndAbort');
const errorDigest = require('./errorDigest');
const makeHandlers = require('./handlers');
const getConfig = makeGetConfig();
const config = Object.assign({concurrency: 1, agentId}, getConfig());
const logger = createLogger(config.showLogs);
const handlers = makeHandlers({
  logger,
  config,
  makeVisualGridClient,
  processCloseAndAbort,
  getErrorsAndDiffs,
  errorDigest,
});
const app = startApp({handlers, logger});
const startServer = makeStartServer({app, logger});

logger.log('eyes.cypress plugin running with config:', config);

module.exports = makePluginExport({startServer, config});
