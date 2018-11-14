'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const chalk = require('chalk');
const errorDigest = require('../../../src/plugin/errorDigest');
const {TestResults} = require('@applitools/visual-grid-client');

// cypress wraps the error digest in red and 3 space indentation, and we throw the error digest in an `Error`
function _wrap(str) {
  return chalk.red(`   ${new Error(str)}`);
}

describe('error digest', () => {
  it('works', () => {
    const testErrors = [new Error('bla'), new Error('bloo')];
    const diffTestResults = [
      new TestResults({
        name: 'test1',
        hostDisplaySize: {width: 100, height: 200},
        url: 'url1',
      }),
      new TestResults({
        name: 'test2',
        hostDisplaySize: {width: 300, height: 400},
        url: 'url2',
      }),
    ];
    const passedTestResults = [
      new TestResults({
        name: 'test3',
        hostDisplaySize: {width: 1, height: 2},
      }),
    ];
    const output = errorDigest({
      passedTestResults,
      testErrors,
      diffTestResults,
      logger: {log: () => {}},
    });

    // NOTE: this is a try to validate the expected output.
    // It was very hard to construct this expected string, so if this becomes a maintenance nightmare, I suggest not to try and preserve it.
    // It was mainly written for debugging purposes in order to quickly craft the output without having to run Cypress.
    const expectedOutput = `Eyes.Cypress detected diffs or errors during execution of visual tests:
       ${chalk.green('Passed - 1 tests')}
         ${chalk.green('\u2713')} ${chalk.reset('test3 [1x2]')}
       ${chalk.red('Diffs detected - 2 tests')}
         ${chalk.red('\u2716')} ${chalk.reset('test1 [100x200]')}
         ${chalk.red('\u2716')} ${chalk.reset('test2 [300x400]')}
       ${chalk.red('Errors - 2 tests')}
         ${chalk.red('\u2716')} ${chalk.reset('Error: bla')}
         ${chalk.red('\u2716')} ${chalk.reset('Error: bloo')}

       See details at: url1`;

    // console.log(_wrap(output)); // debugging
    expect(output).to.equal(expectedOutput);
  });
});
