'use strict';
const {presult} = require('@applitools/functional-commons');

async function processCloseAndAbort({runningTests, closeBatch, logger}) {
  const closeAll = runningTests.map(async ({closePromise, abort}) => {
    if (closePromise) {
      const [closeErr, closeResult] = await closePromise;
      if (closeErr) {
        return (await abort()).map(testResult => {
          if (testResult) {
            testResult.error = closeErr;
            return testResult;
          } else {
            return closeErr;
          }
        });
      } else {
        return closeResult;
      }
    } else {
      return (await abort()).filter(x => !!x);
    }
  });

  const results = await Promise.all(closeAll);
  const [err] = await presult(closeBatch());
  if (err) {
    logger.log('failed to close batch', err);
  }
  return results;
}

module.exports = processCloseAndAbort;
