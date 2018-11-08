'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const {presult} = require('@applitools/functional-commons');
const makeWaitForBatch = require('../../../src/plugin/waitForBatch');
const concurrencyMsg = require('../../../src/plugin/concurrencyMsg');
const getErrorsAndDiffs = require('../../../src/plugin/getErrorsAndDiffs');
const errorDigest = require('../../../src/plugin/errorDigest');
const {promisify: p} = require('util');
const psetTimeout = p(setTimeout);
const {TestResults, TestResultsStatus} = require('@applitools/visual-grid-client');

function createPassedClosePromise() {
  return presult(Promise.resolve([{getStatus: () => TestResultsStatus.Passed}]));
}

describe('waitForBatch', () => {
  const logger = process.env.APPLITOOLS_SHOW_LOGS ? console : {log: () => {}};

  it("returns test count when there's no error", async () => {
    const runningTests = [
      {closePromise: createPassedClosePromise()},
      {closePromise: createPassedClosePromise()},
    ];

    const waitForBatch = makeWaitForBatch({
      logger,
      runningTests,
      getErrorsAndDiffs,
    });

    expect(await waitForBatch()).to.eql(2);
  });

  it('throws error with digest when found errors', async () => {
    const diffTestResults = [
      TestResults.fromObject({
        status: TestResultsStatus.Unresolved,
        hostDisplaySize: {width: 1, height: 2},
        url: 'url',
      }),
    ];
    const err = new Error('bla');
    const passedTestResults = [
      TestResults.fromObject({
        status: TestResultsStatus.Passed,
        hostDisplaySize: {width: 3, height: 4},
      }),
    ];
    const runningTests = [
      {closePromise: presult(Promise.reject(err))},
      {
        closePromise: presult(Promise.resolve(diffTestResults)),
      },
      {closePromise: presult(Promise.resolve(passedTestResults))},
    ];

    const waitForBatch = makeWaitForBatch({
      logger,
      runningTests,
      getErrorsAndDiffs,
    });

    const msg = await waitForBatch().then(() => 'ok', err => err.message);

    const output = errorDigest({
      passedTestResults,
      diffTestResults,
      testErrors: [err],
      logger: {log: () => {}},
    });

    expect(msg).to.equal(output);
  });

  it('waits for aborted tests', async () => {
    let abortFlag;
    const runningTests = [
      {
        abort: async () => {
          await psetTimeout(50);
          abortFlag = true;
        },
      },
    ];

    const waitForBatch = makeWaitForBatch({
      logger,
      runningTests,
      getErrorsAndDiffs,
    });

    await waitForBatch();
    expect(abortFlag).to.equal(true);
  });

  it('outputs concurrency message', async () => {
    const origLog = console.log;
    try {
      const runningTests = [{closePromise: createPassedClosePromise()}];
      let output = '';
      console.log = (...args) => (output += args.join(', '));

      const waitForBatch = makeWaitForBatch({
        logger,
        runningTests,
        concurrency: 1,
        getErrorsAndDiffs,
      });

      expect(await waitForBatch()).to.eql(1);
      expect(output).to.equal(concurrencyMsg);
    } finally {
      console.log = origLog;
    }
  });

  it('outputs concurrency message also with env var', async () => {
    const origLog = console.log;
    try {
      const runningTests = [{closePromise: createPassedClosePromise()}];
      let output = '';
      console.log = (...args) => (output += args.join(', '));

      const waitForBatch = makeWaitForBatch({
        logger,
        runningTests,
        concurrency: '1',
        getErrorsAndDiffs,
      });

      expect(await waitForBatch()).to.eql(1);
      expect(output).to.equal(concurrencyMsg);
    } finally {
      console.log = origLog;
    }
  });
});
