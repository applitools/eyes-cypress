'use strict';
const {createLogger} = require('@applitools/rendering-grid-client');

const logger = new Logger();
const logHandler = process.env.APPLITOOLS_DEV_MODE
  ? new ConsoleLogHandler(true)
  : new NullLogHandler();

logger.setLogHandler(logHandler);

module.exports = logger;
