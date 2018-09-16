'use strict';
const errorDigest = require('./errorDigest');

function makeWaitForBatch({waitForTestResults, runningTests, logger, DiffsFoundError}) {
  return async function() {
    const closePromises = runningTests.filter(getClosePromise).map(getClosePromise);
    const aborts = runningTests.filter(test => !test.closePromise).map(test => test.abort);

    logger.log(
      `Waiting for test results of ${closePromises.length} closed tests. Going to abort ${
        aborts.length
      } tests`,
    );

    const [testResults] = await Promise.all([
      waitForTestResults(closePromises),
      Promise.all(aborts.map(abort => abort())),
    ]);

    const testErrors = testResults.filter(result => result instanceof Error);
    if (testErrors.length) {
      throw new Error(
        errorDigest({testCount: testResults.length, testErrors, DiffsFoundError, logger}),
      );
    }

    return testResults;
  };
}

function getClosePromise(test) {
  return test.closePromise;
}

module.exports = makeWaitForBatch;
