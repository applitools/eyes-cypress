'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const openEyes = require('../src/server/openEyes');
const FakeEyesWrapper = require('./FakeEyesWrapper');
const testServer = require('./testServer');
const domNodesToCdt = require('../src/client/domNodesToCdt');

describe('openEyes', () => {
  let baseUrl, closeServer;

  before(async () => {
    const server = await testServer();
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
    const cdt = require('./fixtures/test.cdt.json');
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
    const cdt = require('./fixtures/test.cdt.json');
    cdt.find(node => node.nodeValue === "hi, I'm red").nodeValue = "hi, I'm green";
    const result = await checkWindow({resourceUrls, cdt});
    expect(result.getAsExpected()).to.equal(false);
    await close();
  });
});
