'use strict';
const pollingHandler = require('./pollingHandler');
const {initConfig} = require('./config');
const getConfig = initConfig(process.cwd());

function makeHandlers(openEyes) {
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

    putResource: (id, buffer) => {
      if (!resources) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesCheckWindow()');
      }
      resources[id] = buffer;
    },

    checkWindow: async ({resourceUrls, cdt, tag, blobData = [], sizeMode, domCapture}) => {
      if (!checkWindow) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesCheckWindow()');
      }

      const resourceContents = blobData.reduce((acc, {url, type}) => {
        acc[url] = {url, type, value: resources[url]};
        return acc;
      }, {});

      return await checkWindow({resourceUrls, resourceContents, cdt, tag, sizeMode, domCapture});
    },

    close: async ({timeout} = {}) => {
      if (!close) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesClose()');
      }

      resources = null;
      return await close(timeout);
    },
  };
}

module.exports = makeHandlers;
