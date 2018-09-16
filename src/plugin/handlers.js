'use strict';
const pollingHandler = require('./pollingHandler');
const makeWaitForBatch = require('./waitForBatch');
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
      const waitForBatch = makeWaitForBatch({
        waitForTestResults: client.waitForTestResults,
        runningTests,
        logger,
        DiffsFoundError,
      });
      pollBatchEnd = pollingHandler(waitForBatch, TIMEOUT_MSG);
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

  function makeClose(doClose, runningTest) {
    return async function() {
      runningTest.closePromise = doClose().catch(err => {
        logger.log('error in close', err);
        return err;
      });
      return runningTest.closePromise;
    };
  }
}

module.exports = makeHandlers;
module.exports.TIMEOUT_MSG = TIMEOUT_MSG;
