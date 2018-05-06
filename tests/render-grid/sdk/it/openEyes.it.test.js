'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const openEyes = require('../../../../src/render-grid/sdk/openEyes');
const FakeEyesWrapper = require('../../../util/FakeEyesWrapper');
const testServer = require('../../../util/testServer');
const {loadJsonFixture} = require('../../../util/loadFixture');

describe('openEyes', () => {
  let baseUrl, closeServer, wrapper;

  before(async () => {
    const server = await testServer({port: 3456}); // TODO fixed port avoids 'need-more-resources' for dom. Is this desired? should both paths be tested?
    baseUrl = `http://localhost:${server.port}`;
    closeServer = server.close;
    wrapper = new FakeEyesWrapper({
      goodFilename: 'test.cdt.json',
      goodResourceUrls: [`${baseUrl}/smurfs.jpg`, `${baseUrl}/test.css`],
    });
  });

  after(() => {
    closeServer();
  });

  it("doesn't throw exception", async () => {
    const {checkWindow, close} = openEyes({
      wrapper,
      url: `${baseUrl}/test.html`,
    });
    const result = await checkWindow({});
    expect(result.getAsExpected()).to.equal(true);
    await close();
  });

  it('passes with correct dom', async () => {
    const {checkWindow, close} = openEyes({
      wrapper,
      url: `${baseUrl}/test.html`,
    });

    const resourceUrls = wrapper.goodResourceUrls;
    const cdt = loadJsonFixture('test.cdt.json');
    const result = await checkWindow({resourceUrls, cdt});
    expect(result.getAsExpected()).to.equal(true);

    wrapper.goodFilename = 'test.cdt.1.json';
    wrapper.goodResourceUrls = [`${baseUrl}/smurfs.jpg`, `${baseUrl}/test.1.css`];
    const cdt1 = loadJsonFixture('test.cdt.1.json');
    const resourceUrls1 = wrapper.goodResourceUrls;
    const result1 = await checkWindow({resourceUrls: resourceUrls1, cdt: cdt1});
    expect(result1.getAsExpected()).to.equal(true);

    await close();
  });

  it('fails with incorrect dom', async () => {
    const {checkWindow, close} = openEyes({
      wrapper,
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
