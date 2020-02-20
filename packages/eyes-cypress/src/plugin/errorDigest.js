'use strict';
const chalk = require('chalk');

function errorDigest({passed, failed, diffs, logger}) {
  logger.log('errorDigest: diff errors', diffs);
  logger.log('errorDigest: test errors', failed);

  const testLink = diffs.length ? `\n\n${indent(2)}See details at: ${diffs[0].getUrl()}` : '';

  return `Eyes-Cypress detected diffs or errors during execution of visual tests:
${indent(2)}${chalk.green(`Passed - ${passed.length} tests`)}${testResultsToString(passed, true)}
${indent(2)}${chalk.red(`Diffs detected - ${diffs.length} tests`)}${testResultsToString(diffs)}
${indent(2)}${chalk.red(`Errors - ${failed.length} tests`)}${testResultsToString(
    failed,
  )}${testLink}`;
}

function stringifyTestResults(testResults) {
  return `${testResults.getName()} [${testResults.getHostDisplaySize()}]${
    testResults.error ? ` : ${testResults.error}` : ''
  }`;
}

function stringifyError(error) {
  return `[Eyes test not started] : ${error}`;
}

function testResultsToString(testResultsArr, isGood) {
  return testResultsArr.length
    ? `\n${indent(3)}${testResultsArr
        .map(
          testResults =>
            `${isGood ? chalk.green('\u2713') : chalk.red('\u2716')} ${chalk.reset(
              testResults instanceof Error
                ? stringifyError(testResults)
                : stringifyTestResults(testResults),
            )}`,
        )
        .join(`\n${indent(3)}`)}`
    : '';
}

function indent(count) {
  return `   ${'  '.repeat(count)}`;
}

module.exports = errorDigest;
