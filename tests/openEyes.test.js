'use strict';
require('dotenv').config();
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const openEyes = require('../src/server/openEyes');
const FakeEyesWrapper = require('./FakeEyesWrapper');
const testServer = require('./testServer');
const {DiffsFoundError} = require('@applitools/eyes.sdk.core');

function loadJson(filepath) {
  const json = require(filepath);
  return JSON.parse(JSON.stringify(json));
}

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

  it("doesn't throw exception", async () => {
    const {checkWindow, close} = openEyes({
      wrapper: FakeEyesWrapper,
      url: `${baseUrl}/test.html`, // TODO test different forms of url? or leave that to unit tests?
    });
    const resourceUrls = ['smurfs.jpg', 'test.css'];
    const result = await checkWindow({resourceUrls});
    expect(result.getAsExpected()).to.equal(true);
    await close();
  });

  it('passes with correct dom', async () => {
    const {checkWindow, close} = openEyes({
      wrapper: FakeEyesWrapper,
      url: `${baseUrl}/test.html`,
    });
    const resourceUrls = ['smurfs.jpg', 'test.css'];
    const cdt = loadJson('./fixtures/test.cdt.json');
    const result = await checkWindow({resourceUrls, cdt});
    expect(result.getAsExpected()).to.equal(true);
    await close();
  });

  it('fails with incorrect dom', async () => {
    const {checkWindow, close} = openEyes({
      wrapper: FakeEyesWrapper,
      url: `${baseUrl}/test.html`,
    });
    const resourceUrls = ['smurfs.jpg', 'test.css'];
    const cdt = loadJson('./fixtures/test.cdt.json');
    cdt.find(node => node.nodeValue === "hi, I'm red").nodeValue = "hi, I'm green";
    const result = await checkWindow({resourceUrls, cdt});
    expect(result.getAsExpected()).to.equal(false);
    await close();
  });

  it('really works', async () => {
    const {checkWindow, close} = openEyes({
      appName: 'some app',
      testName: 'some test',
      apiKey: process.env.APPLITOOLS_API_KEY, // TODO bad for tests. what to do
      url: `${baseUrl}/test.html`,
      viewportSize: {width: 800, height: 600},
    });

    const resourceUrls = ['smurfs.jpg', 'test.css'];
    const cdt = loadJson('./fixtures/test.cdt.json');
    await checkWindow({resourceUrls, cdt});
    await close();
  });

  it('really works and fails', async () => {
    const {checkWindow, close} = openEyes({
      appName: 'some app',
      testName: 'some test',
      apiKey: process.env.APPLITOOLS_API_KEY, // TODO bad for tests. what to do
      url: `${baseUrl}/test.html`,
      viewportSize: {width: 800, height: 600},
    });

    const resourceUrls = ['smurfs.jpg', 'test.css'];
    const cdt = loadJson('./fixtures/test.cdt.json');
    cdt.find(node => node.nodeValue === "hi, I'm red").nodeValue = "hi, I'm green";
    await checkWindow({resourceUrls, cdt});
    expect(await close().then(() => 'ok', err => err)).to.be.instanceOf(DiffsFoundError);
  });
});
