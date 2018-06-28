const pollingHandler = require('./pollingHandler');
const {initConfig} = require('./config');
const getConfig = initConfig(process.cwd());

const DEFAULT_TIMEOUT = 120000;

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

    checkWindow: async ({resourceUrls, cdt, tag}) => {
      if (!checkWindow) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesCheckWindow()');
      }

      return await checkWindow({resourceUrls, cdt, tag});
    },

    close: async ({timeout = DEFAULT_TIMEOUT} = {}) => {
      if (!close) {
        throw new Error('Please call cy.eyesOpen() before calling cy.eyesClose()');
      }

      return await close({timeout});
    },
  };
}

module.exports = makeHandlers;
