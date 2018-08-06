'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

function startApp(handlers, logger) {
  const app = express();
  app.use(cors());
  app.get('/hb', (_req, res) => res.sendStatus(200));
  app.get('/err', (_req, res) => res.status(500).send('this is a test error'));

  app.put('/eyes/resource/:id', bodyParser.raw({type: '*/*', limit: '100mb'}), async (req, res) => {
    try {
      if (!req.params || !req.params.id) throw new Error('missing resource url');
      const id = decodeURIComponent(req.params.id);
      const buffer = Buffer.from(JSON.parse(req.body).data);
      logger.log('[server] PUT resource:', id, buffer.length);
      handlers.putResource(id, buffer);
      res.status(200).send({success: true});
    } catch (ex) {
      logger.log('[server] error in PUT resource', req.params.id, ex);
      res.status(200).send({success: false, error: ex.message});
    }
  });

  app.post('/eyes/:command', express.json({limit: '100mb'}), async (req, res) => {
    logger.log(`[server] eyes api: ${req.params.command}`, Object.keys(req.body));
    try {
      const result = await handlers[req.params.command](req.body);
      res.set('Content-Type', 'application/json');
      res.status(200).send({success: true, result});
    } catch (ex) {
      logger.log('[server] error in eyes api:', ex);
      res.status(200).send({success: false, error: ex.message});
    }
  });

  return app;
}

module.exports = {startApp};
