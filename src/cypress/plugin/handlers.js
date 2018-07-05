'use strict';
const pollingHandler = require('./pollingHandler');
const {initConfig} = require('./config');
const getConfig = initConfig(process.cwd());

function makeHandlers(openEyes) {
  let checkWindow, close;

  return {
    open: async args => {
      const config = Object.assign(getConfig(args));
      const eyes = await openEyes(config);
      checkWindow = eyes.checkWindow;
      close = pollingHandler(eyes.close);
      return eyes;
    },

    checkWindow: async args => {
      if (!checkWindow) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesCheckWindow()');
      }

      return await checkWindow(args);
    },

    close: async ({timeout} = {}) => {
      if (!close) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesClose()');
      }

      return await close(timeout);
    },
  };
}

module.exports = makeHandlers;
