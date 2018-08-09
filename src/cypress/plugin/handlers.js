'use strict';
const pollingHandler = require('./pollingHandler');

function makeHandlers({openEyes, batchStart, batchEnd}) {
  let checkWindow, close, resources;
  const pollBatchEnd = pollingHandler(batchEnd);

  return {
    open: async args => {
      const eyes = await openEyes(args);
      checkWindow = eyes.checkWindow;
      close = eyes.close;
      resources = {};
      return eyes;
    },

    batchStart: args => {
      return batchStart(args);
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
      if (!close) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesClose()');
      }

      resources = null;

      try {
        close(); // not returning this promise because we don't to wait on it before responding to the client
      } finally {
        close = null;
        checkWindow = null;
      }
    },
  };
}

module.exports = makeHandlers;
