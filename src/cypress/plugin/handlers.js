'use strict';
const pollingHandler = require('./pollingHandler');

function makeHandlers({makeRenderingGridClient, logger = console}) {
  let openEyes, pollBatchEnd, checkWindow, close, resources, openErr;

  return {
    open: async args => {
      try {
        const eyes = await openEyes(args);
        checkWindow = eyes.checkWindow;
        close = eyes.close;
        resources = {};
        return eyes;
      } catch (err) {
        openErr = err;
        throw err;
      }
    },

    batchStart: args => {
      const client = makeRenderingGridClient(args);
      openEyes = client.openEyes;
      pollBatchEnd = pollingHandler(client.batchEnd);
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
      close().catch(err => {
        logger.log('error in close:', err);
      });

      resources = null;
      close = null;
      checkWindow = null;
      openErr = null;
    },
  };
}

module.exports = makeHandlers;
