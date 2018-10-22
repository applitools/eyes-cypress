'use strict';
const pollingHandler = require('./pollingHandler');
const {PollingStatus} = pollingHandler;
const makeWaitForBatch = require('./waitForBatch');
const {DiffsFoundError} = require('@applitools/visual-grid-client');

const TIMEOUT_MSG = timeout =>
  `Eyes.Cypress timed out after ${timeout}ms. The default timeout is 2 minutes. It's possible to increase this timeout by setting a the value of 'eyesTimeout' in Cypress configuration, e.g. for 3 minutes: Cypress.config('eyesTimeout', 180000)`;

function makeHandlers({makeVisualGridClient, config = {}, logger = console}) {
  logger.log('[handlers] creating handlers with the following config:', config);
  let pollOpenEyes, pollBatchEnd, checkWindow, close, resources, openErr;
  let runningTests = [];

  return {
    open: async args => {
      try {
        logger.log(`[handlers] open: close=${typeof close}, args=`, args);
        const pollResult = await pollOpenEyes({timeout: 3600000, args});
        logger.log('[handlers] open polling result', pollResult);
        if (pollResult.status === PollingStatus.DONE) {
          const eyes = pollResult.results;
          const runningTest = {
            abort: eyes.abort,
            closePromise: undefined,
          };
          checkWindow = eyes.checkWindow;
          close = makeClose(eyes.close, runningTest);
          resources = {};
          runningTests.push(runningTest);
          logger.log('[handlers] open finished');
        }

        return pollResult;
      } catch (err) {
        logger.log(`[handlers] openEyes error ${err}`);
        openErr = err;
        throw err;
      }
    },

    batchStart: () => {
      logger.log('[handlers] batchStart');
      runningTests = [];
      const client = makeVisualGridClient(config);
      pollOpenEyes = pollingHandler(client.openEyes, TIMEOUT_MSG);
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
      logger.log(`[handlers] batchEnd, timeout=${timeout}`);
      return await pollBatchEnd({timeout});
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
      selector,
      region,
      scriptHooks,
      ignore,
      frames = [],
      sendDom,
    }) => {
      logger.log(`[handlers] checkWindow: checkWindow=${typeof checkWindow}`);
      if (!checkWindow) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesCheckWindow()');
      }

      const resourceContents = blobDataToResourceContents(blobData);
      const framesWithResources = createResourceContents(frames);

      return await checkWindow({
        url,
        resourceUrls,
        resourceContents,
        cdt,
        tag,
        sizeMode,
        selector,
        region,
        scriptHooks,
        ignore,
        frames: framesWithResources,
        sendDom,
      });
    },

    close: async () => {
      logger.log(
        `[handlers] close: openErr=${openErr}, close=${typeof close}, checkWindow=${typeof checkWindow}, resources=${
          resources ? `count:${Object.keys(resources).length}` : resources
        }`,
      );
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

  function createResourceContents(frames) {
    return frames.map(frame => {
      return {
        url: frame.url,
        cdt: frame.cdt,
        resourceUrls: frame.resourceUrls,
        resourceContents: blobDataToResourceContents(frame.blobs),
        frames: frame.frames ? createResourceContents(frame.frames) : undefined,
      };
    });
  }

  function blobDataToResourceContents(blobData) {
    return blobData.reduce((acc, {url, type}) => {
      acc[url] = {url, type, value: resources[url]};
      return acc;
    }, {});
  }
}

module.exports = makeHandlers;
module.exports.TIMEOUT_MSG = TIMEOUT_MSG;
