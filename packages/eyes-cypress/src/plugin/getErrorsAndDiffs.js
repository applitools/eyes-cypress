'use strict';

function getErrorsAndDiffs(testResultsArr) {
  return testResultsArr.reduce(
    ({failed, diffs, passed}, testResults) => {
      if (testResults instanceof Error || testResults.error) {
        failed.push(testResults);
      } else {
        if (testResults.getStatus() === 'Unresolved') {
          if (testResults.getIsNew()) {
            testResults.error = new Error(
              `${testResults.getName()}. Please approve the new baseline at ${testResults.getUrl()}`,
            );
            failed.push(testResults);
          } else {
            diffs.push(testResults);
          }
        } else if (testResults.getStatus() === 'Failed') {
          failed.push(testResults);
        } else {
          passed.push(testResults);
        }
      }

      return {failed, diffs, passed};
    },
    {
      failed: [],
      diffs: [],
      passed: [],
    },
  );
}

module.exports = getErrorsAndDiffs;
