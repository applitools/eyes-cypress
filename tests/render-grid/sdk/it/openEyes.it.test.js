'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const openEyes = require('../../../../src/render-grid/sdk/openEyes');
const FakeEyesWrapper = require('../../../util/FakeEyesWrapper');
const testServer = require('../../../util/testServer');
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
    const cdt = loadJsonFixture('test.cdt.json');
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
    const cdt = loadJsonFixture('test.cdt.json');
    cdt.find(node => node.nodeValue === "hi, I'm red").nodeValue = "hi, I'm green";
    const result = await checkWindow({resourceUrls, cdt});
    expect(result.getAsExpected()).to.equal(false);
    await close();
  });
});
