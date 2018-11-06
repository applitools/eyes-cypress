'use strict';
const errorDigest = require('./errorDigest');
const concurrencyMsg = require('./concurrencyMsg');

function makeWaitForBatch({runningTests, logger, concurrency, getErrorsAndDiffs}) {
  return async function() {
    const closePromises = runningTests.filter(getClosePromise).map(getClosePromise);
    const aborts = runningTests.filter(test => !test.closePromise).map(test => test.abort);

    logger.log(
      `Waiting for test results of ${closePromises.length} closed tests. Going to abort ${
        aborts.length
      } tests`,
    );

    const [{testErrors, diffTestResults, passedTestResults}] = await Promise.all([
      getErrorsAndDiffs(closePromises),
      Promise.all(aborts.map(abort => abort())),
    ]);

    if (concurrency == 1) {
      console.log(concurrencyMsg);
    }

    if (testErrors.length || diffTestResults.length) {
      throw new Error(errorDigest({passedTestResults, testErrors, diffTestResults, logger}));
    }

    return passedTestResults.length + testErrors.length + testErrors.length;
  };
}

function getClosePromise(test) {
  return test.closePromise;
}

module.exports = makeWaitForBatch;
