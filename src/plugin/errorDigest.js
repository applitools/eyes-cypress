'use strict';
const chalk = require('chalk');

function errorDigest({passedTestResults, testErrors, diffTestResults, logger}) {
  logger.log('errorDigest: diff errors', diffTestResults);
  logger.log('errorDigest: test errors', testErrors);

  const testLink = diffTestResults.length
    ? `\n\n${indent(2)}See details at: ${diffTestResults[0].getUrl()}`
    : '';

  return `Eyes.Cypress detected diffs or errors during execution of visual tests:
${indent(2)}${chalk.green(`Passed - ${passedTestResults.length} tests`)}${itemToString(
    passedTestResults,
    stringifyTestResults,
    true,
  )}
${indent(2)}${chalk.red(`Diffs detected - ${diffTestResults.length} tests`)}${itemToString(
    diffTestResults,
    stringifyTestResults,
  )}
${indent(2)}${chalk.red(`Errors - ${testErrors.length} tests`)}${itemToString(
    testErrors,
    stringifyException,
  )}${testLink}`;
}

function stringifyTestResults(testResults) {
  return `${testResults.getName()} [${testResults.getHostDisplaySize()}]`;
}

function stringifyException(error) {
  return `${error}`;
}

function itemToString(items, stringify, isGood) {
  return items.length
    ? `\n${indent(3)}${items
        .map(
          err =>
            `${isGood ? chalk.green('\u2713') : chalk.red('\u2716')} ${chalk.reset(
              stringify(err),
            )}`,
        )
        .join(`\n${indent(3)}`)}`
    : '';
}

function indent(count) {
  return `   ${'  '.repeat(count)}`;
}

module.exports = errorDigest;
