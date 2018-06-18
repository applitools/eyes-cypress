'use strict';
const {describe, it, before, after, beforeEach} = require('mocha');
const {expect} = require('chai');
const openEyes = require('../../../../src/render-grid/sdk/openEyes');
const FakeEyesWrapper = require('../../../util/FakeEyesWrapper');
const testServer = require('../../../util/testServer');
const {loadJsonFixture} = require('../../../util/loadFixture');

describe.only('openEyes', () => {
  let baseUrl, closeServer, wrapper;

  before(async () => {
    const server = await testServer({port: 3456}); // TODO fixed port avoids 'need-more-resources' for dom. Is this desired? should both paths be tested?
    baseUrl = `http://localhost:${server.port}`;
    closeServer = server.close;
  });

  after(() => {
    closeServer();
  });

  beforeEach(() => {
    openEyes.clearBatch();
    wrapper = new FakeEyesWrapper({
      goodFilename: 'test.cdt.json',
      goodResourceUrls: [`${baseUrl}/smurfs.jpg`, `${baseUrl}/test.css`],
      goodTags: ['good1', 'good2'],
    });
  });

  it("doesn't throw exception", async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      url: `${baseUrl}/test.html`,
    });
    await checkWindow({cdt: [], resourceUrls: [], tag: 'good1'});
    expect((await close()).map(r => r.getAsExpected())).to.eql([true]);
  });

  it('throws with bad tag', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      url: `${baseUrl}/test.html`,
    });
    await checkWindow({cdt: [], resourceUrls: [], tag: 'bad!'});
    expect(await close().then(() => 'ok', () => 'not ok')).to.equal('not ok');
  });

  it('passes with correct dom', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      url: `${baseUrl}/test.html`,
    });

    const resourceUrls = wrapper.goodResourceUrls;
    const cdt = loadJsonFixture('test.cdt.json');
    await checkWindow({resourceUrls, cdt, tag: 'good1'});

    expect((await close()).map(r => r.getAsExpected())).to.eql([true]);
  });

  it('fails with incorrect dom', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      url: `${baseUrl}/test.html`,
    });
    const resourceUrls = ['smurfs.jpg', 'test.css'];
    const cdt = loadJsonFixture('test.cdt.json');
    cdt.find(node => node.nodeValue === "hi, I'm red").nodeValue = "hi, I'm green";

    await checkWindow({resourceUrls, cdt, tag: 'good1'});

    expect((await close()).map(r => r.getAsExpected())).to.eql([false]);
  });

  it('renders multiple viewport sizes', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper, wrapper, wrapper],
      viewportSize: [
        {width: 320, height: 480},
        {width: 640, height: 768},
        {width: 1600, height: 900},
      ],
      url: `${baseUrl}/test.html`,
    });

    const resourceUrls = wrapper.goodResourceUrls;
    const cdt = loadJsonFixture('test.cdt.json');
    await checkWindow({resourceUrls, cdt, tag: 'good1'});
    expect((await close()).map(r => r.getAsExpected())).to.eql([true, true, true]);
  });

  it('runs all tests in the same batch', async () => {
    const batch = `some batch ${Date.now()}`;
    wrapper.setBatch(batch);
    expect(wrapper.getBatch() === batch); // sometimes I'm a little defensive. It's human

    await openEyes({
      wrappers: [wrapper],
      url: 'some url',
    });

    const newWrapper = new FakeEyesWrapper({});
    await openEyes({wrappers: [newWrapper]});
    expect(newWrapper.getBatch()).to.equal(batch);
  });
});
