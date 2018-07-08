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

  const fakeOpenEyes = args => ({
    checkWindow: async ({resourceUrls, cdt, tag} = {}) => {
      return {__test: `checkWindow_${args.__test}`, resourceUrls, cdt, tag};
    },

    close: async () => {
      return new Promise((_resolve, _reject) => {
        resolve = _resolve;
        reject = _reject;
      });
    },
  });

  function __resolveClose(val) {
    return resolve && resolve(val);
  }

  function __rejectClose(val) {
    return reject && reject(new Error(val));
  }

  beforeEach(() => {
    handlers = makeHandlers(fakeOpenEyes);
  });

  it('handles "open"', async () => {
    const {checkWindow} = await handlers.open({__test: 123});

    expect((await checkWindow()).__test).to.equal('checkWindow_123');
  });

  it('throws when calling "checkWindow" before "open"', async () => {
    expect(await handlers.checkWindow({}).then(x => x, err => err)).to.be.an.instanceof(Error);
  });

  it('throws when calling "close" before "open"', async () => {
    expect(await handlers.close().then(x => x, err => err)).to.be.an.instanceof(Error);
  });

  it('handles "checkWindow"', async () => {
    await handlers.open({__test: 123});

    const cdt = 'cdt';
    const resourceUrls = 'resourceUrls';
    const tag = 'tag';

    const result = await handlers.checkWindow({cdt, resourceUrls, tag});

    expect(result).to.eql({__test: 'checkWindow_123', resourceUrls, cdt, tag});
  });

  it('handles "close"', async () => {
    await handlers.open({__test: 123});

    // IDLE ==> WIP
    let result = await handlers.close();
    expect(result).to.eql({status: PollingStatus.IDLE});

    // WIP ==> WIP
    result = await handlers.close();
    expect(result).to.eql({status: PollingStatus.WIP});

    // WIP ==> DONE
    const successMsg = 'success';
    __resolveClose(successMsg);
    await psetTimeout(0);

    // DONE ==> IDLE
    result = await handlers.close();
    expect(result).to.eql({status: PollingStatus.DONE, results: successMsg});

    // IDLE ==> WIP
    result = await handlers.close();
    expect(result).to.eql({status: PollingStatus.IDLE});

    // WIP ==> ERROR
    const failMsg = 'fail';
    __rejectClose(failMsg);
    await psetTimeout(0);

    // ERROR ==> IDLE
    result = await handlers.close().then(x => x, err => err);
    expect(result).to.be.an.instanceof(Error);
    expect(result.message).to.equal(failMsg);

    // IDLE ==> WIP (with timeout)
    result = await handlers.close({timeout: 50});
    expect(result).to.eql({status: PollingStatus.IDLE});

    await psetTimeout(100);
    result = await handlers.close().then(x => x, err => err);
    expect(result).to.be.an.instanceof(Error);
    expect(result.message).to.equal(TIMEOUT_MSG);
  });
});
