'use strict';
const pollingHandler = require('./pollingHandler');
const {PollingStatus} = pollingHandler;

function makeHandlers({openEyes, getConfig, updateConfig, getInitialConfig, getBatch, logger}) {
  let checkWindow, close, resources;

  return {
    open: async args => {
      const config = Object.assign(getConfig(args));
      const eyes = await openEyes(config);
      checkWindow = eyes.checkWindow;
      close = pollingHandler(eyes.close);
      resources = {};
      return eyes;
    },

    batchStart() {
      const defaultBatch = getBatch(getInitialConfig());
      logger.log('new default batch', defaultBatch);
      updateConfig(defaultBatch);
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
      });
    },

    close: async ({timeout} = {}) => {
      if (!close) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesClose()');
      }

      resources = null;
      let result;
      try {
        result = await close(timeout);
        return result;
      } finally {
        if (!result || result.status === PollingStatus.DONE) {
          close = null;
          checkWindow = null;
        }
      }
    },
  };
}

module.exports = makeHandlers;
