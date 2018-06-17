const {Logger, ConsoleLogHandler} = require('@applitools/eyes.sdk.core');

const logger = new Logger();
logger.setLogHandler(new ConsoleLogHandler(true));

function log(msg) {
  logger.verbose(msg);
}

log.setIsVerbose = function(isVerbose) {
  logger._logHandler.setIsVerbose(isVerbose);
};

module.exports = log;
