require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const openEyes = require('../render-grid/sdk/openEyes');
const log = require('../render-grid/sdk/log');

const app = express();
app.use(cors());
app.use(morgan('combined'));

app.post('/eyes/:command', express.json(), async (req, res) => {
  log(`eyes api: ${req.params.command}, ${Object.keys(req.body)}`);
  try {
    await eyesCommands[req.params.command](req.body); // TODO not every command needs to be awaited (defaultCommandTimeout)
    res.sendStatus(200);
  } catch (ex) {
    console.error('error in eyes api:', ex.message);
    res.sendStatus(500);
  }
});

const eyesCommands = {
  open: async ({url, appName, testName, viewportSize}) => {
    const eyes = await openEyes({apiKey, url, appName, testName, viewportSize});
    checkWindow = eyes.checkWindow;
    close = eyes.close;
  },

  checkWindow: async ({resourceUrls, cdt, tag}) => {
    await checkWindow({resourceUrls, cdt, tag});
  },

  close: async () => {
    await close();
  },
};

const apiKey = process.env.APPLITOOLS_API_KEY;
let checkWindow, close;

module.exports = () => {
  return new Promise((resolve, _reject) => {
    const server = app.listen(0, () => {
      const eyesPort = server.address().port;
      const close = server.close.bind(server);
      log(`server running at port: ${eyesPort}`);
      resolve({eyesPort, close});
    });
  });
};
