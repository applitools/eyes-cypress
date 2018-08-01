'use strict';
const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const {initConfig} = require('../../../src/cypress/plugin/config');
const makePluginExport = require('../../../src/cypress/plugin/pluginExport');
const {promisify: p} = require('util');
const psetTimeout = p(setTimeout);

let batchIdCounter = 0;
function getBatch({batchId: _batchId} = {}) {
  return {batchId: batchIdCounter++};
}

describe('pluginExport', () => {
  let pluginExport, getConfig, prevEnv;

  let eyesPort;

  function setEyesPort(port) {
    eyesPort = port;
  }
  function getEyesPort() {
    return eyesPort;
  }

  beforeEach(() => {
    prevEnv = process.env;
    process.env = {};
    const {getConfig: _getConfig, updateConfig, getInitialConfig} = initConfig();
    pluginExport = makePluginExport({
      updateConfig,
      getInitialConfig,
      getBatch,
      logger: console,
      getEyesPort,
      setEyesPort,
    });
    getConfig = _getConfig;
  });

  afterEach(() => {
    process.env = prevEnv;
  });

  it('works', async () => {
    const __module = {
      exports: (_on, config) => {
        x = config;
        return {bla: `ret_${config}`};
      },
    };
    let count = 0;
    const on = (event, callback) => {
      ev = `${count}_${event}`;
      args = callback(`${count}_browser`, `${count}_args`);
      count++;
    };

    let x;
    let ev;
    let args;

    pluginExport(__module);
    const ret = await __module.exports(on, 'first');

    expect(x).to.equal('first');
    expect(ev).to.equal('0_before:browser:launch');
    expect(ret).to.eql({bla: 'ret_first', eyesPort: undefined});
    expect(args).to.equal('0_args');
    expect(getConfig()).to.eql({batchId: 0});

    const ret2 = await __module.exports(on, 'second');
    expect(x).to.equal('second');
    expect(ev).to.equal('1_before:browser:launch');
    expect(ret2).to.eql({bla: 'ret_second', eyesPort: undefined});
    expect(args).to.equal('1_args');
    expect(getConfig()).to.eql({batchId: 1});
  });

  it('sets eyes port', async () => {
    const __module = {exports: () => ({bla: 'bla'})};
    pluginExport(__module, {port: 1234});
    const ret = await __module.exports(() => {});
    expect(ret).to.eql({eyesPort: 1234, bla: 'bla'});
  });

  it('handles async module.exports', async () => {
    const __module = {
      exports: async () => {
        await psetTimeout(0);
        return {bla: 'bla'};
      },
    };

    pluginExport(__module);
    const ret = await __module.exports(() => {});
    expect(ret).to.eql({bla: 'bla', eyesPort: undefined});
  });
});
