'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const startServer = require('../../src/cypress/plugin');
const startTestServer = require('../util/testServer');
const makeSend = require('../../src/cypress/makeSend');
const fetch = require('node-fetch');
const {loadJsonFixture} = require('../util/loadFixture');

describe('cypress plugin', () => {
  let baseUrl, closeTestServer, send, closePluginServer;

  before(async () => {
    const testServer = await startTestServer();
    baseUrl = `http://localhost:${testServer.port}`;
    closeTestServer = testServer.close;

    const pluginServer = await startServer();
    send = makeSend(pluginServer.eyesPort, fetch);
    closePluginServer = pluginServer.close;
  });

  after(() => {
    closeTestServer();
    closePluginServer();
  });

  // TODO 3 separate tests or one test with open+checkWindow+close ?

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
      viewportSize: {width: 800, height: 600},
    });

    const resp = await send('checkWindow', {
      cdt: loadJsonFixture('test.cdt.json'),
      resourceUrls: ['smurfs.jpg', 'test.css'],
    });

    expect(resp.status).to.equal(200);
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
