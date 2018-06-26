const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const log = require('../../render-grid/sdk/log');
const {promisify: p} = require('util');
const eyesCommands = require('./handlers');
const psetTimeout = p(setTimeout);

let eyesPort = require('./defaultPort');
let server;

async function getEyesPort() {
  let port;

  // TODO can server.address() be undefined or null?
  while (!server || !server.address() || !(port = server.address().port)) {
    await psetTimeout(10);
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
  console.log('!!!!');
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
