require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const openEyes = require('../render-grid/sdk/openEyes');
const log = require('../render-grid/sdk/log');
const {promisify: p} = require('util');
const {initConfig} = require('./config');

/*****************************/
/******* Eyes API key *******/
/*****************************/
const getConfig = initConfig(process.cwd());

/*****************************/
/******* Eyes Commands *******/
/*****************************/
let checkWindow, close;

const eyesCommands = {
  open: async args => {
    const config = Object.assign(getConfig(args));
    const eyes = await openEyes(config);
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

/***************************/
/******* Eyes Server *******/
/***************************/
let eyesPort = require('./defaultPort'),
  server;

async function getEyesPort() {
  let port;

  // TODO can server.address() be undefined or null?
  while (!server || !server.address() || !(port = server.address().port)) {
    await p(setTimeout)(10);
  }

  log(`getEyesPort port=${port}`);
  return port;
}

async function closeEyes() {
  if (server) {
    await new Promise((resolve, reject) => server.close(err => (err ? reject(err) : resolve())));
  }
  server = null;
}

const app = express();
app.use(cors());
app.use(morgan('combined'));
app.get('/hb', (_req, res) => res.sendStatus(200));

app.post('/eyes/:command', express.json({limit: '100mb'}), async (req, res) => {
  log(`eyes api: ${req.params.command}, ${Object.keys(req.body)}`);
  try {
    await eyesCommands[req.params.command](req.body);
    res.sendStatus(200);
  } catch (ex) {
    console.error('error in eyes api:', ex);
    console.log(ex.message);
    res.status(500).send(ex.message);
  }
});

// start server after process tick (or as microtask) to allow user to set custom port
Promise.resolve().then(() => {
  log(`starting plugin at port ${eyesPort}`);
  server = app.listen(eyesPort, () => {
    log(`server running at port: ${server.address().port}`);
  });
});

function moduleExports({port = eyesPort} = {}) {
  eyesPort = port;
  return {
    getEyesPort,
    closeEyes,
  };
}

moduleExports.getEyesPort = getEyesPort;
moduleExports.closeEyes = closeEyes;

module.exports = moduleExports;
