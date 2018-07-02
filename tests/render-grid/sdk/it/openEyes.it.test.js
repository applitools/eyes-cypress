'use strict';
const {describe, it, before, after, beforeEach} = require('mocha');
const {expect} = require('chai');
const openEyes = require('../../../../src/render-grid/sdk/openEyes');
const FakeEyesWrapper = require('../../../util/FakeEyesWrapper');
const testServer = require('../../../util/testServer');
const {loadJsonFixture} = require('../../../util/loadFixture');
const {promisify: p} = require('util');
const psetTimeout = p(setTimeout);

describe('openEyes', () => {
  let baseUrl, closeServer, wrapper;
  const apiKey = 'some api key';

  before(async () => {
    const server = await testServer({port: 3456}); // TODO fixed port avoids 'need-more-resources' for dom. Is this desired? should both paths be tested?
    baseUrl = `http://localhost:${server.port}`;
    closeServer = server.close;
  });

  after(() => {
    closeServer();
  });

  beforeEach(() => {
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
      apiKey,
    });
    await checkWindow({cdt: [], resourceUrls: [], tag: 'good1'});
    expect((await close()).map(r => r.getAsExpected())).to.eql([true]);
  });

  it('throws with bad tag', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      url: `${baseUrl}/test.html`,
      apiKey,
    });
    await checkWindow({cdt: [], resourceUrls: [], tag: 'bad!'});
    expect(await close().then(() => 'ok', () => 'not ok')).to.equal('not ok');
  });

  it('passes with correct dom', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      url: `${baseUrl}/test.html`,
      apiKey,
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
      apiKey,
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
      browser: [{width: 320, height: 480}, {width: 640, height: 768}, {width: 1600, height: 900}],
      url: `${baseUrl}/test.html`,
      apiKey,
    });

    const resourceUrls = wrapper.goodResourceUrls;
    const cdt = loadJsonFixture('test.cdt.json');
    await checkWindow({resourceUrls, cdt, tag: 'good1'});
    expect((await close()).map(r => r.getAsExpected())).to.eql([true, true, true]);
  });

  it('handles `batchName` and `batchId` param', async () => {
    const batchName = `some batch name ${Date.now()}`;
    const batchId = `some batch ID ${Date.now()}`;
    await openEyes({
      wrappers: [wrapper],
      url: 'some url',
      apiKey,
      batchName,
      batchId,
    });

    expect(wrapper.getBatch().getName()).to.equal(batchName);
    expect(wrapper.getBatch().getId()).to.equal(batchId);
  });

  it('renders the correct sizeMode', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      browser: {width: 320, height: 480},
      url: `${baseUrl}/test.html`,
      apiKey,
    });

    const resourceUrls = wrapper.goodResourceUrls;
    const cdt = loadJsonFixture('test.cdt.json');
    await checkWindow({resourceUrls, cdt, tag: 'good1', sizeMode: 'some size mode'});
    expect((await close()).map(r => r.getAsExpected())).to.eql([true]);
  });

  it('runs matchWindow in the correct order', async () => {
    const wrapper1 = new FakeEyesWrapper({goodFilename: 'test.cdt.json', goodResourceUrls: []});
    const wrapper2 = new FakeEyesWrapper({goodFilename: 'test.cdt.json', goodResourceUrls: []});

    wrapper1.checkWindow = async ({tag}) => {
      if (tag === 'one') {
        await psetTimeout(200);
      } else if (tag === 'two') {
        await psetTimeout(50);
      }
      return `${tag}1`;
    };

    wrapper2.checkWindow = async ({tag}) => {
      if (tag === 'one') {
        await psetTimeout(150);
      } else if (tag === 'two') {
        await psetTimeout(150);
      }
      return `${tag}2`;
    };

    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper1, wrapper2],
      browser: [{width: 320, height: 480}, {width: 640, height: 768}],
      url: `${baseUrl}/test.html`,
      apiKey,
    });

    const resourceUrls = wrapper.goodResourceUrls;
    const cdt = loadJsonFixture('test.cdt.json');
    await checkWindow({resourceUrls, cdt, tag: 'one'});
    await checkWindow({resourceUrls, cdt, tag: 'two'});
    await checkWindow({resourceUrls, cdt, tag: 'three'});
    const results = await close();
    expect(results).to.eql(['one2', 'one1', 'two1', 'three1', 'two2', 'three2']);
  });

  // TODO
  it.skip('renders the correct browser', async () => {
    const {checkWindow, close} = await openEyes({
      wrappers: [wrapper],
      browser: {width: 320, height: 480, browser: 'ucbrowser'},
      url: `${baseUrl}/test.html`,
      apiKey,
    });

    const resourceUrls = wrapper.goodResourceUrls;
    const cdt = loadJsonFixture('test.cdt.json');
    await checkWindow({resourceUrls, cdt, tag: 'good1', sizeMode: 'some size mode'});
    expect((await close()).map(r => r.getAsExpected())).to.eql([true]);
  });
});
