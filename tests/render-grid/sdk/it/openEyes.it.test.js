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
      goodFilenames: {good1: 'test.cdt.json', good2: 'test.cdt.1.json'},
      goodResourceUrls: {
        good1: [`${baseUrl}/smurfs.jpg`, `${baseUrl}/test.css`],
        good2: [`${baseUrl}/smurfs.jpg`, `${baseUrl}/test.1.css`],
      },
      goodTags: ['good1', 'good2'],
    });
  });

  after(() => {
    closeServer();
  });

  it("doesn't throw exception", async () => {
    const {checkWindow, close} = await openEyes({
      wrapper,
      url: `${baseUrl}/test.html`,
    });
    await checkWindow({tag: 'good1'});
    expect((await close()).map(r => r.getAsExpected())).to.eql([false]);
  });

  it('throws with bad tag', async () => {
    const {checkWindow, close} = await openEyes({
      wrapper,
      url: `${baseUrl}/test.html`,
    });
    await checkWindow({tag: 'bad!'});
    expect(await close().then(() => 'ok', () => 'not ok')).to.equal('not ok');
  });

  it('passes with correct dom', async () => {
    const {checkWindow, close} = await openEyes({
      wrapper,
      url: `${baseUrl}/test.html`,
    });

    const resourceUrls = wrapper.goodResourceUrls.good1;
    const cdt = loadJsonFixture('test.cdt.json');
    await checkWindow({resourceUrls, cdt, tag: 'good1'});

    const resourceUrls1 = wrapper.goodResourceUrls.good2;
    const cdt1 = loadJsonFixture('test.cdt.1.json');
    await checkWindow({resourceUrls: resourceUrls1, cdt: cdt1, tag: 'good2'});

    expect((await close()).map(r => r.getAsExpected())).to.eql([true, true]);
  });

  it('fails with incorrect dom', async () => {
    const {checkWindow, close} = await openEyes({
      wrapper,
      url: `${baseUrl}/test.html`,
    });
    const resourceUrls = ['smurfs.jpg', 'test.css'];
    const cdt = loadJsonFixture('test.cdt.json');
    cdt.find(node => node.nodeValue === "hi, I'm red").nodeValue = "hi, I'm green";

    await checkWindow({resourceUrls, cdt, tag: 'good1'});

    expect((await close()).map(r => r.getAsExpected())).to.eql([false]);
  });
});
