'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const pollingHandler = require('../../../src/plugin/pollingHandler');
const {PollingStatus} = pollingHandler;
const {promisify: p} = require('util');
const psetTimeout = p(setTimeout);

describe('pollingHandler', () => {
  it('calls doWork when IDLE', async () => {
    let x;
    const doWork = async args => {
      x = args;
    };
    const poll = pollingHandler(doWork);

    let {status} = poll({args: 'arg'});
    expect(x).to.equal('arg');
    expect(status).to.equal(PollingStatus.IDLE);
  });

  it('returns DONE with results when doWork finishes', async () => {
    const doWork = async args => args;
    const poll = pollingHandler(doWork);

    let {status} = poll({args: 'arg'});
    expect(status).to.equal(PollingStatus.IDLE);
    await psetTimeout(0);
    const result = poll({});
    expect(result.status).to.equal(PollingStatus.DONE);
    expect(result.results).to.equal('arg');
  });

  it('returns ERROR with error when doWork throws', async () => {
    const doWork = args => Promise.reject(args);
    const poll = pollingHandler(doWork);

    poll({args: 'arg'});
    await psetTimeout(0);
    const result = poll({});
    expect(result.status).to.equal(PollingStatus.ERROR);
    expect(result.error).to.equal('arg');
  });

  it('returns TIMEOUT with timeoutUsed when doWork times out', async () => {
    const doWork = async args => {
      await psetTimeout(100);
      return args;
    };
    const poll = pollingHandler(doWork);

    poll({args: 'arg', timeout: 0});
    await psetTimeout(50);
    const result = poll({});
    expect(result.status).to.equal(PollingStatus.TIMEOUT);
    expect(result.timeoutUsed).to.equal(0);
  });

  it('returns WIP until doWork finishes', async () => {
    const doWork = async args => {
      await psetTimeout(50);
      return args;
    };
    const poll = pollingHandler(doWork);

    poll({args: 'arg'});
    await psetTimeout(0);
    let result = poll({});
    expect(result.status).to.equal(PollingStatus.WIP);
    await psetTimeout(0);
    result = poll({});
    expect(result.status).to.equal(PollingStatus.WIP);
    await psetTimeout(50);
    result = poll({});
    expect(result.status).to.equal(PollingStatus.DONE);
  });

  it('returns IDLE after doWork finishes', async () => {
    const doWork = async args => args;
    const poll = pollingHandler(doWork);

    poll({args: 'arg'});
    await psetTimeout(0);
    let result = poll({});
    expect(result.status).to.equal(PollingStatus.DONE);
    result = poll({});
    expect(result.status).to.equal(PollingStatus.IDLE);
  });
});
