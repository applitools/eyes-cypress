'use strict';

function processCloseAndAbort(runningTests) {
  return Promise.all(
    runningTests.map(async ({closePromise, abort}) => {
      if (closePromise) {
        const [closeErr, closeResult] = await closePromise;
        if (closeErr) {
          return (await getAbortResults()).map(testResult => {
            testResult.error = closeErr;
            return testResult;
          });
        } else {
          return closeResult;
        }
      } else {
        return getAbortResults();
      }

      async function getAbortResults() {
        return (await abort()).filter(x => !!x);
      }
    }),
  );
}

module.exports = processCloseAndAbort;
