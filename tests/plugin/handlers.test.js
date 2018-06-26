const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const startTestServer = require('../util/testServer');
const handlers = require('../../src/cypress/plugin/handlers');
const {loadJsonFixture} = require('../util/loadFixture');

describe('command handlers', () => {
  let baseUrl, closeTestServer;

  before(async () => {
    const testServer = await startTestServer();
    baseUrl = `http://localhost:${testServer.port}`;
    closeTestServer = testServer.close;
  });

  after(async () => {
    await closeTestServer();
  });

  it('handles "open"', async () => {
    const {checkWindow, close} = await handlers.open({
      url: '', //`${baseUrl}/test.html`,
      appName: 'plugin e2e test',
      testName: 'handle open',
      viewportSize: {width: 800, height: 600},
      // showLogs: true,
    });

    expect(checkWindow).to.be.an.instanceof(Function);
    expect(close).to.be.an.instanceof(Function);
  });

  it('handles "checkWindow"', async () => {
    await handlers.open({
      url: `${baseUrl}/test.html`,
      appName: 'plugin e2e test',
      testName: 'handle checkWindow',
      tag: 'good1',
      viewportSize: {width: 800, height: 600},
      // showLogs: true,
    });

    await handlers.checkWindow({
      cdt: loadJsonFixture('test.cdt.json'),
      resourceUrls: ['smurfs.jpg', 'test.css'],
    });

    expect(await handlers.close()).to.be.an('array');
  });

  it('handles "close"', async () => {
    await handlers.open({
      url: '', //`${baseUrl}/test.html`,
      appName: 'plugin e2e test',
      testName: 'handle close',
      viewportSize: {width: 800, height: 600},
      // showLogs: true,
    });

    const results = await handlers.close();
    console.log('results', results);
    expect(results).to.be.empty;
  });
});
