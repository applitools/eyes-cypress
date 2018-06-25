'use strict';
const {describe, it, before, after, afterEach} = require('mocha');
const {expect} = require('chai');
const startTestServer = require('../util/testServer');
const makeSend = require('../../src/cypress/makeSend');
const fetch = require('node-fetch');
const {loadJsonFixture} = require('../util/loadFixture');
const pluginPath = '../../src/cypress/plugin';

describe('cypress plugin', () => {
  let baseUrl, closeTestServer;

  before(async () => {
    const testServer = await startTestServer();
    baseUrl = `http://localhost:${testServer.port}`;
    closeTestServer = testServer.close;
  });

  after(async () => {
    await closeTestServer();
  });

  afterEach(() => {
    delete require.cache[require.resolve(pluginPath)];
  });

  describe('command handlers', () => {
    let send, closePluginServer;
    before(async () => {
      const {getEyesPort, closeEyes} = require('../../src/cypress/plugin');
      const port = await getEyesPort();
      send = makeSend(port, fetch);
      closePluginServer = closeEyes;
    });

    after(async () => {
      await closePluginServer();
    });

    it('handles "open"', async () => {
      const resp = await send('open', {
        url: '', //`${baseUrl}/test.html`,
        appName: 'plugin e2e test',
        testName: 'handle open',
        viewportSize: {width: 800, height: 600},
      });

      expect(resp.status).to.equal(200);
    });

    it('handles "checkWindow"', async () => {
      await send('open', {
        url: `${baseUrl}/test.html`,
        appName: 'plugin e2e test',
        testName: 'handle checkWindow',
        tag: 'good1',
        viewportSize: {width: 800, height: 600},
        // showLogs: true,
      });

      const resp = await send('checkWindow', {
        cdt: loadJsonFixture('test.cdt.json'),
        resourceUrls: ['smurfs.jpg', 'test.css'],
      });

      expect(resp.status).to.equal(200);

      expect((await send('close')).status).to.equal(200);
    });

    it('handles "close"', async () => {
      await send('open', {
        url: '', //`${baseUrl}/test.html`,
        appName: 'plugin e2e test',
        testName: 'handle close',
        viewportSize: {width: 800, height: 600},
      });

      const resp = await send('close');

      expect(resp.status).to.equal(200);
    });
  });

  describe('custom port', () => {
    it('starts at a custom port', async () => {
      const {getEyesPort, closeEyes} = require('../../src/cypress/plugin')({port: 7374});
      const port = await getEyesPort();
      expect(port).to.equal(7374);
      const send = makeSend(port, fetch);

      const resp = await send('open', {
        url: '',
        appName: 'plugin e2e test',
        testName: 'custom port',
        viewportSize: {width: 800, height: 600},
      });
      expect(resp.status).to.equal(200);

      await closeEyes();
    });

    it('starts at a random port', async () => {
      const {getEyesPort, closeEyes} = require('../../src/cypress/plugin')({port: 0});
      const port = await getEyesPort();
      const send = makeSend(port, fetch);

      const resp = await send('open', {
        url: '',
        appName: 'plugin e2e test',
        testName: 'custom port',
        viewportSize: {width: 800, height: 600},
      });
      expect(resp.status).to.equal(200);

      await closeEyes();
    });
  });
});
