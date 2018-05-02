const {Logger, ConsoleLogHandler} = require('@applitools/eyes.sdk.core');

const logger = new Logger();
logger.setLogHandler(new ConsoleLogHandler(true));

function log(msg) {
  logger.verbose(msg);
}

module.exports = log;
