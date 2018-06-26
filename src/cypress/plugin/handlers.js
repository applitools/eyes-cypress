const openEyes = require('../../render-grid/sdk/openEyes');
const {initConfig} = require('./config');
const getConfig = initConfig(process.cwd());

const DEFAULT_TIMEOUT = 120000;

let checkWindow, close;

const eyesCommands = {
  open: async args => {
    const config = Object.assign(getConfig(args));
    const eyes = await openEyes(config);
    checkWindow = eyes.checkWindow;
    close = eyes.close;
    return eyes;
  },

  checkWindow: async ({resourceUrls, cdt, tag}) => {
    return await checkWindow({resourceUrls, cdt, tag});
  },

  close: async ({timeout = DEFAULT_TIMEOUT} = {}) => {
    let timeoutId;
    return Promise.race([
      close().then(results => {
        clearTimeout(timeoutId);
        return results;
      }),
      new Promise((_resolve, reject) => {
        timeoutId = setTimeout(() => {
          reject(
            new Error(
              "The cy.eyesClose command timed out. The default timeout is 2 minutes. It's possible to increase this timeout by passing a larger value, e.g. for 3 minutes: cy.eyesClose({ timeout: 180000 })",
            ),
          );
        }, timeout);
      }),
    ]);
  },
};

module.exports = eyesCommands;
