'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const makeHandlers = require('../../../src/plugin/handlers');
const getErrorsAndDiffs = require('../../../src/plugin/getErrorsAndDiffs');
const processCloseAndAbort = require('../../../src/plugin/processCloseAndAbort');
const errorDigest = require('../../../src/plugin/errorDigest');

describe('handlers', () => {
  describe('batchStart', () => {
    let handlers, _vgcConfig;

    before(() => {
      handlers = makeHandlers({
        makeVisualGridClient: config => ((_vgcConfig = config), {}),
        config: {},
        logger: console,
        processCloseAndAbort,
        getErrorsAndDiffs,
        errorDigest,
      });
    });

    it('sets VGC with the given viewport', async () => {
      handlers.batchStart({viewport: {width: 200, height: 300}});
      expect(_vgcConfig).to.deep.eq({browser: {width: 200, height: 300}});
    });

    it('sets VGC with the config viewport and not the handler data', async () => {
      const handlers = makeHandlers({
        makeVisualGridClient: config => ((_vgcConfig = config), {}),
        config: {browser: {width: 400, height: 400}},
        logger: console,
        processCloseAndAbort,
        getErrorsAndDiffs,
        errorDigest,
      });
      handlers.batchStart({viewport: {width: 200, height: 300}});
      expect(_vgcConfig).to.deep.eq({browser: {width: 400, height: 400}});
    });

    it('does not set VGC with a wrong viewport', async () => {
      handlers.batchStart({});
      expect(_vgcConfig).to.deep.eq({});

      handlers.batchStart({viewport: {width: 200}});
      expect(_vgcConfig).to.deep.eq({});

      handlers.batchStart({viewport: {width: null, height: null}});
      expect(_vgcConfig).to.deep.eq({});
    });
  });
});
