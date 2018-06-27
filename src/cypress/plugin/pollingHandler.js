const PollingStatus = {
  IDLE: 'IDLE',
  WIP: 'WIP',
  DONE: 'DONE',
  TIMEOUT: 'TIMEOUT',
  ERROR: 'ERROR',
};

const TIMEOUT_MSG =
  "The cy.eyesClose command timed out. The default timeout is 2 minutes. It's possible to increase this timeout by passing a larger value, e.g. for 3 minutes: cy.eyesClose({ timeout: 180000 })";

function pollingHandler(doWork) {
  let timeoutId,
    pollingStatus = PollingStatus.IDLE,
    workError,
    workResults;

  return ({timeout}) => {
    switch (pollingStatus) {
      case PollingStatus.IDLE:
        pollingStatus = PollingStatus.WIP;
        timeoutId = setTimeout(() => {
          pollingStatus = PollingStatus.TIMEOUT;
          timeoutId = null;
        }, timeout);
        doWork()
          .then(results => {
            pollingStatus = PollingStatus.DONE;
            clearTimeout(timeoutId);
            timeoutId = null;
            workResults = results;
          })
          .catch(ex => {
            clearTimeout(timeoutId);
            timeoutId = null;
            pollingStatus = PollingStatus.ERROR;
            workError = ex;
          });
        return {status: PollingStatus.IDLE};
      case PollingStatus.WIP:
        return {status: PollingStatus.WIP};

      case PollingStatus.DONE:
        pollingStatus = PollingStatus.IDLE;
        return {status: PollingStatus.DONE, results: workResults};

      case PollingStatus.TIMEOUT:
        pollingStatus = PollingStatus.IDLE;
        throw new Error(TIMEOUT_MSG);

      case PollingStatus.ERROR:
        pollingStatus = PollingStatus.IDLE;
        throw workError;

      default:
        throw new Error('Unknown error during cy.eyesClose()');
    }
  };
}

module.exports = pollingHandler;
module.exports.PollingStatus = PollingStatus;
module.exports.TIMEOUT_MSG = TIMEOUT_MSG;
