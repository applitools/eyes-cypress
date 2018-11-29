'use strict';

function processCloseAndAbort(runningTests) {
  return Promise.all(
    runningTests.map(async ({closePromise, abort}) => {
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
    }),
  );
}

module.exports = processCloseAndAbort;
