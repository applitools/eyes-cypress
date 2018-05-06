'use strict';
require('dotenv').config();
const {describe, it, before, after} = require('mocha');
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

  after(() => {
    closeServer();
  });

  it('passes with correct screenshot', async () => {
    const {checkWindow, close} = openEyes({
      appName: 'some app',
      testName: 'some test',
      apiKey: process.env.APPLITOOLS_API_KEY, // TODO bad for tests. what to do
      url: `${baseUrl}/test.html`,
      viewportSize: {width: 800, height: 600},
    });

    const resourceUrls = ['smurfs.jpg', 'test.css'];
    const cdt = loadJsonFixture('test.cdt.json');
    await checkWindow({resourceUrls, cdt});
    await close();
  });

  it('fails with incorrect screenshot', async () => {
    const {checkWindow, close} = openEyes({
      appName: 'some app',
      testName: 'some test',
      apiKey: process.env.APPLITOOLS_API_KEY, // TODO bad for tests. what to do
      url: `${baseUrl}/test.html`,
      viewportSize: {width: 800, height: 600},
    });

    const resourceUrls = ['smurfs.jpg', 'test.css'];
    const cdt = loadJsonFixture('test.cdt.json');
    cdt.find(node => node.nodeValue === "hi, I'm red").nodeValue = "hi, I'm green";
    await checkWindow({resourceUrls, cdt});
    expect(await close().then(() => 'ok', err => err)).to.be.instanceOf(DiffsFoundError);
  });
});
