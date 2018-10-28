'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const makeWaitForBatch = require('../../../src/plugin/waitForBatch');
const concurrencyMsg = require('../../../src/plugin/concurrencyMsg');
const {promisify: p} = require('util');
const psetTimeout = p(setTimeout);

describe('waitForBatch', () => {
  class DiffsFoundError extends Error {}
  const waitForTestResults = async closePromises =>
    await Promise.all(closePromises.map(p => p.then(x => x, err => err)));

  const logger = process.env.APPLITOOLS_SHOW_LOGS ? console : {log: () => {}};

  it("returns test results when there's no error", async () => {
    const runningTests = [
      {closePromise: Promise.resolve('bla')},
      {closePromise: Promise.resolve('bloo')},
    ];

    const waitForBatch = makeWaitForBatch({
      waitForTestResults,
      logger,
      runningTests,
      DiffsFoundError,
    });

    expect(await waitForBatch()).to.eql(['bla', 'bloo']);
  });

  it('throws error with digest when found errors', async () => {
    const errors = [new Error('bla'), new DiffsFoundError('bloo')];
    const runningTests = errors.map(err => ({closePromise: Promise.reject(err)})).concat({
      closePromise: Promise.resolve('blee'),
    });

    const waitForBatch = makeWaitForBatch({
      waitForTestResults,
      logger,
      runningTests,
      DiffsFoundError,
    });

    const msg = await waitForBatch().then(() => 'ok', err => err.message);

    const output = `
  Passed - 1 tests.
  Diffs detected - 1 tests.
\t\t\t1) Error: bloo
  Errors - 1 tests.
\t\t\t1) Error: bla`;

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
      waitForTestResults,
      logger,
      runningTests,
      DiffsFoundError,
    });

    await waitForBatch();
    expect(abortFlag).to.equal(true);
  });

  it('outputs concurrency message', async () => {
    const origLog = console.log;
    try {
      const runningTests = [{closePromise: Promise.resolve('bla')}];
      let output = '';
      console.log = (...args) => (output += args.join(', '));

      const waitForBatch = makeWaitForBatch({
        waitForTestResults,
        logger,
        runningTests,
        DiffsFoundError,
        concurrency: 1,
      });

      expect(await waitForBatch()).to.eql(['bla']);
      expect(output).to.equal(concurrencyMsg);
    } finally {
      console.log = origLog;
    }
  });

  it('outputs concurrency message also with env var', async () => {
    const origLog = console.log;
    try {
      const runningTests = [{closePromise: Promise.resolve('bla')}];
      let output = '';
      console.log = (...args) => (output += args.join(', '));

      const waitForBatch = makeWaitForBatch({
        waitForTestResults,
        logger,
        runningTests,
        DiffsFoundError,
        concurrency: '1',
      });

      expect(await waitForBatch()).to.eql(['bla']);
      expect(output).to.equal(concurrencyMsg);
    } finally {
      console.log = origLog;
    }
  });
});
