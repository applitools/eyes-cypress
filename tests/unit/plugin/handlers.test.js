'use strict';
const {describe, it, beforeEach} = require('mocha');
const {expect} = require('chai');
const makeHandlers = require('../../../src/cypress/plugin/handlers');
const {PollingStatus, TIMEOUT_MSG} = require('../../../src/cypress/plugin/pollingHandler');
const {promisify: p} = require('util');
const psetTimeout = p(setTimeout);

describe('command handlers', () => {
  let handlers;
  let resolve, reject;

  const fakeOpenEyes = (args = {}) => ({
    checkWindow: async (args2 = {}) => {
      return Object.assign(args2, {__test: `checkWindow_${args.__test}`});
    },

    close: async () => {
      return {__test: `close_${args.__test}`};
    },
  });

  const openEyesWithCloseRejection = () => ({
    checkWindow: async x => x,
    close: async () => Promise.reject('bla'),
  });

  const fakeBatchEnd = async () => {
    return new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
  };

  function __resolveBatchEnd(val) {
    return resolve && resolve(val);
  }

  function __rejectBatchEnd(val) {
    return reject && reject(new Error(val));
  }

  async function openAndClose() {
    await handlers.open();
    await handlers.close().catch(x => x);
  }

  beforeEach(() => {
    handlers = makeHandlers({
      openEyes: fakeOpenEyes,
      batchEnd: fakeBatchEnd,
    });
  });

  it('handles "open"', async () => {
    const {checkWindow} = await handlers.open({__test: 123});

    expect((await checkWindow()).__test).to.equal('checkWindow_123');
  });

  it('throws when calling "checkWindow" before "open"', async () => {
    expect(await handlers.checkWindow({}).then(x => x, err => err)).to.be.an.instanceof(Error);
    await openAndClose();
    expect(await handlers.checkWindow({}).then(x => x, err => err)).to.be.an.instanceof(Error);

    handlers = handlers = makeHandlers({
      openEyes: openEyesWithCloseRejection,
    });
    expect(await handlers.checkWindow({}).then(x => x, err => err)).to.be.an.instanceof(Error);
    await openAndClose();
    expect(await handlers.checkWindow({}).then(x => x, err => err)).to.be.an.instanceof(Error);
  });

  it('throws when calling "close" before "open"', async () => {
    expect(await handlers.close().then(x => x, err => err)).to.be.an.instanceof(Error);
    await openAndClose();
    expect(await handlers.close().then(x => x, err => err)).to.be.an.instanceof(Error);

    handlers = handlers = makeHandlers({
      openEyes: openEyesWithCloseRejection,
    });
    expect(await handlers.close().then(x => x, err => err)).to.be.an.instanceof(Error);
    await openAndClose();
    expect(await handlers.close().then(x => x, err => err)).to.be.an.instanceof(Error);
  });

  it('handles "checkWindow"', async () => {
    await handlers.open({__test: 123});

    const cdt = 'cdt';
    const resourceUrls = 'resourceUrls';
    const tag = 'tag';
    const sizeMode = 'sizeMode';
    const domCapture = 'domCapture';
    const selector = 'selector';
    const region = 'region';
    const url = 'url';
    const scriptHooks = 'scriptHooks';
    const ignore = 'ignore';
    const resourceContents = {};

    const result = await handlers.checkWindow({
      cdt,
      resourceUrls,
      tag,
      url,
      sizeMode,
      domCapture,
      selector,
      region,
      scriptHooks,
      ignore,
    });

    expect(result).to.eql({
      __test: 'checkWindow_123',
      resourceUrls,
      cdt,
      tag,
      sizeMode,
      url,
      domCapture,
      selector,
      region,
      resourceContents,
      scriptHooks,
      ignore,
    });
  });

  it('handles "putResource"', async () => {
    await handlers.open({__test: 123});

    handlers.putResource('id1', 'buff1');
    handlers.putResource('id2', 'buff2');
    handlers.putResource('id3', 'buff3');

    const blobData = [
      {url: 'id1', type: 'type1'},
      {url: 'id2', type: 'type2'},
      {url: 'id3', type: 'type3'},
    ];

    const resourceContents = {
      id1: {url: 'id1', type: 'type1', value: 'buff1'},
      id2: {url: 'id2', type: 'type2', value: 'buff2'},
      id3: {url: 'id3', type: 'type3', value: 'buff3'},
    };

    const result = await handlers.checkWindow({blobData});
    expect(result.resourceContents).to.eql(resourceContents);
  });

  it('cleans resources on close', async () => {
    await handlers.open({__test: 123});

    handlers.putResource('id', 'buff');
    const blobData = [{url: 'id', type: 'type'}];
    const expectedResourceContents = {
      id: {url: 'id', type: 'type', value: 'buff'},
    };
    const {resourceContents: actualResourceContents} = await handlers.checkWindow({blobData});

    expect(actualResourceContents).to.eql(expectedResourceContents);
    handlers.close();

    const err = await handlers.checkWindow({blobData}).then(x => x, err => err);
    expect(err).to.be.an.instanceOf(Error);
    const err2 = await handlers.close().then(x => x, err => err);
    expect(err2).to.be.an.instanceOf(Error);
    await handlers.open({__test: 123});
    const {resourceContents: emptyResourceContents} = await handlers.checkWindow({blobData});
    expect(emptyResourceContents).to.eql({
      id: {url: 'id', type: 'type', value: undefined},
    });
  });

  it('handles "close"', async () => {
    const {checkWindow, close} = await handlers.open({__test: 123});

    expect((await checkWindow()).__test).to.equal('checkWindow_123');
    expect((await close()).__test).to.equal('close_123');
  });

  it('handles "batchStart"', () => {
    let flag;
    handlers = makeHandlers({
      batchStart: () => (flag = 'flag'),
    });
    handlers.batchStart();
    expect(flag).to.equal(flag);
  });

  it('handles "batchEnd"', async () => {
    await handlers.open();

    // IDLE ==> WIP
    let result = await handlers.batchEnd();
    expect(result).to.eql({status: PollingStatus.IDLE});

    // WIP ==> WIP
    result = await handlers.batchEnd();
    expect(result).to.eql({status: PollingStatus.WIP});

    // WIP ==> DONE
    const successMsg = 'success';
    __resolveBatchEnd(successMsg);
    await psetTimeout(0);

    // DONE ==> IDLE
    result = await handlers.batchEnd();
    expect(result).to.eql({status: PollingStatus.DONE, results: successMsg});

    // IDLE ==> WIP
    await handlers.open(); // needs to be called because handlers don't allow calling close() before open();
    result = await handlers.batchEnd();
    expect(result).to.eql({status: PollingStatus.IDLE});

    // WIP ==> ERROR
    const failMsg = 'fail';
    __rejectBatchEnd(failMsg);
    await psetTimeout(0);

    // ERROR ==> IDLE
    result = await handlers.batchEnd().then(x => x, err => err);
    expect(result).to.be.an.instanceof(Error);
    expect(result.message).to.equal(failMsg);

    // IDLE ==> WIP (with timeout)
    await handlers.open(); // needs to be called because handlers don't allow calling close() before open();
    result = await handlers.batchEnd({timeout: 50});
    expect(result).to.eql({status: PollingStatus.IDLE});

    await psetTimeout(100);
    result = await handlers.batchEnd().then(x => x, err => err);
    expect(result).to.be.an.instanceof(Error);
    expect(result.message).to.equal(TIMEOUT_MSG(50));
  });
});
