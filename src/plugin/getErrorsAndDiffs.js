'use strict';
const {presult} = require('@applitools/functional-commons');

async function getErrorsAndDiffs(closePromises) {
  const testResultsOrErrs = await Promise.all(closePromises.map(presult));

  return testResultsOrErrs.reduce(
    ({testErrors, diffTestResults, passedTestResults}, [err, testResults]) => {
      if (err) {
        testErrors.push(err);
      } else {
        for (const testResult of testResults) {
          if (testResult.getStatus() === 'Unresolved') {
            if (testResult.getIsNew()) {
              testErrors.push(
                new Error(
                  `${testResult.getName()}. Please approve the new baseline at ${testResult.getUrl()}`,
                ),
              );
            } else {
              diffTestResults.push(testResult);
            }
          } else if (testResult.getStatus() === 'Failed') {
            testErrors.push(new Error(testResult.getName()));
          } else {
            passedTestResults.push(testResult);
          }
        }
      }

      return {testErrors, diffTestResults, passedTestResults};
    },
    {
      testErrors: [],
      diffTestResults: [],
      passedTestResults: [],
    },
  );
}

module.exports = getErrorsAndDiffs;
