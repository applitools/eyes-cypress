'use strict';
const PollingStatus = {
  IDLE: 'IDLE',
  WIP: 'WIP',
  DONE: 'DONE',
  TIMEOUT: 'TIMEOUT',
  ERROR: 'ERROR',
};

const DEFAULT_TIMEOUT = 120000;

function pollingHandler(doWork) {
  let timeoutId,
    timeoutUsed,
    pollingStatus = PollingStatus.IDLE,
    workError,
    workResults;

  return ({args, timeout = DEFAULT_TIMEOUT}) => {
    switch (pollingStatus) {
      case PollingStatus.IDLE:
        pollingStatus = PollingStatus.WIP;
        timeoutUsed = timeout;
        timeoutId = setTimeout(() => {
          pollingStatus = PollingStatus.TIMEOUT;
          timeoutId = null;
        }, timeout);
        doWork(args)
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
        const _timeoutUsed = timeoutUsed;
        timeoutUsed = null;
        return {status: PollingStatus.TIMEOUT, timeoutUsed: _timeoutUsed};

      case PollingStatus.ERROR:
        pollingStatus = PollingStatus.IDLE;
        return {status: PollingStatus.ERROR, error: workError};

      default:
        throw new Error('Unknown error during cy.eyesClose()');
    }
  };
}

module.exports = pollingHandler;
module.exports.PollingStatus = PollingStatus;
