'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

function startApp({handlers, logger = console} = {}) {
  const app = express();
  app.use(cors());
  app.get('/hb', (_req, res) => res.sendStatus(200));
  app.get('/err', (_req, res) => res.status(500).send('this is a test error'));

  app.put('/eyes/resource/:id', bodyParser.raw({type: '*/*', limit: '100mb'}), async (req, res) => {
    try {
      if (!req.params || !req.params.id) throw new Error('missing resource url');
      const id = req.params.id; // already decoded by express with decodeURIComponent
      if (!(req.body instanceof Buffer)) throw new Error(`could not process resource ${id}`); // body-parser returned non-buffer body: https://github.com/expressjs/body-parser/blob/bd386d3a7d540bac90bbdaff88f653414f6647fc/lib/types/raw.js#L62
      const buffer = req.body;
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
