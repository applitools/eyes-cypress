require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const EyesRunner = require('../../src/server/EyesRunner');

const log = (function() {
  const {Logger, ConsoleLogHandler} = require('@applitools/eyes.sdk.core');
  const logger = new Logger();
  logger.setLogHandler(new ConsoleLogHandler(true));
  return msg => {
    logger.verbose(msg);
  };
})();

const app = express();
app.use(cors());
app.use(morgan('combined'));
app.use('/example', express.static('/Users/amit/clients/applitools/eyes.cypress/example'));

app.post('/eyes/:command', express.json(), async (req, res) => {
  log(`eyes api: ${req.params.command}, ${Object.keys(req.body)}`);
  try {
    await eyesCommands[req.params.command](req.body); // TODO not every command needs to be awaited (defaultCommandTimeout)
    res.sendStatus(200);
  } catch (ex) {
    console.error(ex);
    res.sendStatus(500);
  }
});

const eyesCommands = {
  open: ({url, appName, testName, viewportSize}) => {
    const eyesRunner = EyesRunner({apiKey, url, appName, testName, viewportSize});
    checkWindow = eyesRunner.checkWindow;
    close = eyesRunner.close;
  },

  checkWindow: async ({resourceUrls, cdt, tag}) => {
    await checkWindow(resourceUrls, cdt, tag);
  },

  close: async () => {
    await close();
  },
};

const apiKey = process.env.APPLITOOLS_API_KEY;
let checkWindow, close;

module.exports = () => {
  return new Promise((resolve, reject) => {
    const server = app.listen(3456, () => {
      const port = server.address().port;
      log(`server running at port: ${port}`);
      resolve({port});
    });
  });
};
