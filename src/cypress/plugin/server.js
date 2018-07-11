'use strict';
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const {promisify: p} = require('util');
const makeHandlers = require('./handlers');
const psetTimeout = p(setTimeout);
const {openEyes, createLogger} = require('@applitools/rendering-grid-client');
const handlers = makeHandlers(openEyes);
const logger = createLogger();

let eyesPort = require('./defaultPort');
let server;

async function getEyesPort() {
  let port;

  // TODO can server.address() be undefined or null?
  while (!server || !server.address() || !(port = server.address().port)) {
    await psetTimeout(10);
  }

  logger.log(`getEyesPort port=${port}`);
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
if (process.env.APPLITOOLS_DEV_MODE) app.use(morgan('combined'));
app.get('/hb', (_req, res) => res.sendStatus(200));
app.get('/err', (_req, res) => res.status(500).send('this is a test error'));

app.put('/eyes/resource/:id', bodyParser.raw({type: '*/*', limit: '100mb'}), async (req, res) => {
  try {
    handlers.putResource(req.params.id, Buffer.from(JSON.parse(req.body).data));
    res.status(200).send({success: true});
  } catch (ex) {
    console.error('error in PUT resource', req.params && req.params.id, ex);
    res.status(200).send({success: false, error: ex.message});
  }
});

app.post('/eyes/:command', express.json({limit: '100mb'}), async (req, res) => {
  logger.log(`eyes api: ${req.params.command}`, Object.keys(req.body));
  try {
    const result = await handlers[req.params.command](req.body);
    res.set('Content-Type', 'application/json');
    res.status(200).send({success: true, result});
  } catch (ex) {
    logger.log('error in eyes api:', ex);
    res.status(200).send({success: false, error: ex.message});
  }
});

// start server after process tick (or as microtask) to allow user to set custom port
Promise.resolve().then(() => {
  logger.log(`starting plugin at port ${eyesPort}`);
  server = app.listen(eyesPort, () => {
    logger.log(`server running at port: ${server.address().port}`);
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
