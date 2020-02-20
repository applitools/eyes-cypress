'use strict';
const {concurrencyMsg} = require('./concurrencyMsg');
const flatten = require('lodash.flatten');

function makeWaitForBatch({
  logger,
  concurrency,
  processCloseAndAbort,
  getErrorsAndDiffs,
  errorDigest,
  handleBatchResultsFile,
}) {
  return async function(runningTests, closeBatch) {
    logger.log(`Waiting for test results of ${runningTests.length} tests.`);

    const testResultsArr = flatten(await processCloseAndAbort({runningTests, closeBatch, logger}));
    const {failed, diffs, passed} = getErrorsAndDiffs(testResultsArr);
    await handleBatchResultsFile(testResultsArr);

    if (concurrency == 1) {
      console.log(concurrencyMsg);
    }

    if (failed.length || diffs.length) {
      throw new Error(errorDigest({passed, failed, diffs, logger}));
    }

    return passed.length;
  };
}

module.exports = makeWaitForBatch;
