'use strict';
require('dotenv').config();

const apiKey = process.env.APPLITOOLS_API_KEY; // TODO bad for tests. what to do
if (!apiKey) {
  throw new Error('APPLITOOLS_API_KEY env variable is not defined');
}

const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const openEyes = require('../../../src/render-grid/sdk/openEyes');
const testServer = require('../../util/testServer');
const {DiffsFoundError} = require('@applitools/eyes.sdk.core');
const {loadJsonFixture, loadFixtureBuffer} = require('../../util/loadFixture');

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

  it('passes with correct screenshot', async () => {
    const {checkWindow, close} = await openEyes({
      appName: 'some app',
      testName: 'passes with correct screenshot',
      apiKey,
      url: `${baseUrl}/test.html`,
      browser: [
        {width: 640, height: 480, name: 'chrome'},
        {width: 800, height: 600, name: 'firefox'},
      ],
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      saveDebugData: process.env.APPLITOOLS_SAVE_DEBUG_DATA,
    });

    const resourceUrls = ['smurfs.jpg', 'test.css'];
    const cdt = loadJsonFixture('test.cdt.json');
    const resourceContents = {
      [`a-made-up-blob-url-1`]: {
        url: `a-made-up-blob-url-1`,
        type: 'text/css',
        value: loadFixtureBuffer('blob.css'),
      },
      [`a-made-up-blob-url-2`]: {
        url: `a-made-up-blob-url-2`,
        type: 'image/jpeg',
        value: loadFixtureBuffer('smurfs4.jpg'),
      },
    };
    await checkWindow({resourceUrls, resourceContents, cdt, tag: 'first'});
    await close();
  });

  it('fails with incorrect screenshot', async () => {
    const {checkWindow, close} = await openEyes({
      appName: 'some app',
      testName: 'fails with incorrect screenshot',
      apiKey,
      url: `${baseUrl}/test.html`,
      browser: [{width: 640, height: 480}, {width: 800, height: 600}],
      showLogs: process.env.APPLITOOLS_SHOW_LOGS,
      saveDebugData: process.env.APPLITOOLS_SAVE_DEBUG_DATA,
    });

    const resourceUrls = ['smurfs.jpg', 'test.css'];
    const cdt = loadJsonFixture('test.cdt.json');
    cdt.find(node => node.nodeValue === "hi, I'm red").nodeValue = "hi, I'm green";
    const resourceContents = {
      [`a-made-up-blob-url-1`]: {
        url: `a-made-up-blob-url-1`,
        type: 'text/css',
        value: loadFixtureBuffer('blob.css'),
      },
      [`a-made-up-blob-url-2`]: {
        url: `a-made-up-blob-url-2`,
        type: 'image/jpeg',
        value: loadFixtureBuffer('smurfs4.jpg'),
      },
    };
    await checkWindow({resourceUrls, resourceContents, cdt, tag: 'first'});
    expect(await close().then(() => 'ok', err => err)).to.be.instanceOf(DiffsFoundError);
  });
});
