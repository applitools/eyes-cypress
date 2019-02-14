'use strict';

const {version: packageVersion} = require('../../package.json');
const agentId = `eyes.cypress/${packageVersion}`;
const makeStartServer = require('./server');
const makePluginExport = require('./pluginExport');
const {startApp} = require('./app');
const {ConfigUtils, Logger} = require('@applitools/eyes-common');
const {makeVisualGridClient, configParams} = require('@applitools/visual-grid-client');
const getErrorsAndDiffs = require('./getErrorsAndDiffs');
const processCloseAndAbort = require('./processCloseAndAbort');
const errorDigest = require('./errorDigest');
const makeHandlers = require('./handlers');

const config = Object.assign(
  {concurrency: 1, agentId},
  ConfigUtils.getConfig({configParams: [...configParams, 'failCypressOnDiff', 'tapDirPath']}),
);
if (config.failCypressOnDiff === '0') {
  config.failCypressOnDiff = false;
}

const logger = new Logger(config.showLogs);
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
