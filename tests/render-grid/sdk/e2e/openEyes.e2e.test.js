'use strict';
require('dotenv').config();

const apiKey = process.env.APPLITOOLS_API_KEY; // TODO bad for tests. what to do
if (!apiKey) {
  throw new Error('APPLITOOLS_API_KEY env variable is not defined');
}

const {describe, it, before, after, beforeEach} = require('mocha');
const {expect} = require('chai');
const openEyes = require('../../../../src/render-grid/sdk/openEyes');
const testServer = require('../../../util/testServer');
const {DiffsFoundError} = require('@applitools/eyes.sdk.core');
const {loadJsonFixture} = require('../../../util/loadFixture');

describe('openEyes', () => {
  let baseUrl, closeServer;

  before(async () => {
    const server = await testServer({port: 3456}); // TODO fixed port avoids 'need-more-resources' for dom. Is this desired? should both paths be tested?
    baseUrl = `http://localhost:${server.port}`;
    closeServer = server.close;
  });

  after(async () => {
    await closeServer();
  });

  beforeEach(() => {
    openEyes.clearBatch();
  });

  it('passes with correct screenshot', async () => {
    const {checkWindow, close} = await openEyes({
      appName: 'some app',
      testName: 'passes with correct screenshot',
      apiKey,
      url: `${baseUrl}/test.html`,
      viewportSize: [{width: 640, height: 480}, {width: 800, height: 600}],
      // showLogs: true,
    });

    const resourceUrls = ['smurfs.jpg', 'test.css', 'imported2.css'];
    const cdt = loadJsonFixture('test.cdt.json');
    await checkWindow({resourceUrls, cdt, tag: 'first'});
    await close();
  });

  it('fails with incorrect screenshot', async () => {
    const {checkWindow, close} = await openEyes({
      appName: 'some app',
      testName: 'fails with incorrect screenshot',
      apiKey,
      url: `${baseUrl}/test.html`,
      viewportSize: [{width: 640, height: 480}, {width: 800, height: 600}],
      // showLogs: true,
    });

    const resourceUrls = ['smurfs.jpg', 'test.css', 'imported2.css'];
    const cdt = loadJsonFixture('test.cdt.json');
    cdt.find(node => node.nodeValue === "hi, I'm red").nodeValue = "hi, I'm green";
    await checkWindow({resourceUrls, cdt, tag: 'first'});
    expect(await close().then(() => 'ok', err => err)).to.be.instanceOf(DiffsFoundError);
  });
});
