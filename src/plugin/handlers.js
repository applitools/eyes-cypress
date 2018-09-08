'use strict';
const pollingHandler = require('./pollingHandler');
const {DiffsFoundError} = require('@applitools/visual-grid-client');

const TIMEOUT_MSG = timeout =>
  `Eyes.Cypress timed out after ${timeout}ms. The default timeout is 2 minutes. It's possible to increase this timeout by setting a the value of 'eyesTimeout' in Cypress configuration, e.g. for 3 minutes: Cypress.config('eyesTimeout', 180000)`;

function makeHandlers({makeVisualGridClient, logger = console}) {
  let openEyes, pollBatchEnd, checkWindow, close, resources, openErr;
  let runningTests = [];

  return {
    open: async args => {
      try {
        const eyes = await openEyes(args);
        const runningTest = {
          abort: eyes.abort,
          closePromise: undefined,
        };
        checkWindow = eyes.checkWindow;
        close = makeClose(eyes.close, runningTest);
        resources = {};
        runningTests.push(runningTest);
        return eyes;
      } catch (err) {
        openErr = err;
        throw err;
      }
    },

    batchStart: args => {
      runningTests = [];
      const client = makeVisualGridClient(args);
      openEyes = client.openEyes;
      pollBatchEnd = pollingHandler(makeWaitForTestResults(client.waitForTestResults), TIMEOUT_MSG);
      return client;
    },

    batchEnd: async ({timeout} = {}) => {
      return await pollBatchEnd(timeout);
    },

    putResource: (id, buffer) => {
      if (!resources) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesCheckWindow()');
      }
      resources[id] = buffer;
    },

    checkWindow: async ({
      url,
      resourceUrls,
      cdt,
      tag,
      blobData = [],
      sizeMode,
      domCapture,
      selector,
      region,
      scriptHooks,
      ignore,
    }) => {
      if (!checkWindow) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesCheckWindow()');
      }

      const resourceContents = blobData.reduce((acc, {url, type}) => {
        acc[url] = {url, type, value: resources[url]};
        return acc;
      }, {});

      return await checkWindow({
        url,
        resourceUrls,
        resourceContents,
        cdt,
        tag,
        sizeMode,
        domCapture,
        selector,
        region,
        scriptHooks,
        ignore,
      });
    },

    close: async () => {
      if (openErr) {
        return;
      }

      if (!close) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesClose()');
      }

      // not returning this promise because we don't to wait on it before responding to the client
      close();

      resources = null;
      close = null;
      checkWindow = null;
      openErr = null;
    },
  };

  function getClosePromise(test) {
    return test.closePromise;
  }

  function makeWaitForTestResults(waitForTestResults) {
    return async function() {
      const closePromises = runningTests.filter(getClosePromise).map(getClosePromise);
      const aborts = runningTests.filter(test => !test.closePromise).map(test => test.abort);

      logger.log(
        `Waiting for test results of ${closePromises.length} closed tests. Going to abort ${
          aborts.length
        } tests`,
      );

      const [testResults] = await Promise.all([
        waitForTestResults(closePromises),
        Promise.all(aborts.map(abort => abort())),
      ]);

      const testErrors = testResults.filter(result => result instanceof Error);
      const diffErrors = testErrors.filter(err => err instanceof DiffsFoundError);
      const exceptions = testErrors.filter(err => !(err instanceof DiffsFoundError));
      logger.log('waitForTestResults: diff errors', diffErrors);
      logger.log('waitForTestResults: test errors', exceptions);
      if (testErrors.length) {
        throw new Error(
          `
    Passed - ${testResults.length - testResults.length} tests.
    Diffs detected - ${diffErrors.length} tests.${errorDigest(diffErrors)}
    Errors - ${exceptions.length} tests.${errorDigest(exceptions)}`,
        );
      }

      return testResults;
    };
  }

  function makeClose(doClose, runningTest) {
    return async function() {
      runningTest.closePromise = doClose().catch(err => {
        logger.log('error in close', err);
        return err;
      });
      return runningTest.closePromise;
    };
  }

  function errorDigest(errors) {
    return errors.length
      ? `\n\t\t\t${errors.map((err, i) => `${i + 1}) ${err}`).join('\n\t\t\t')}`
      : '';
  }
}

module.exports = makeHandlers;
module.exports.TIMEOUT_MSG = TIMEOUT_MSG;
