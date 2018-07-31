'use strict';
const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const {initConfig} = require('../../../src/cypress/plugin/config');
const makePluginExport = require('../../../src/cypress/plugin/pluginExport');

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

  it('works', () => {
    const __module = {
      exports: (_on, config) => {
        x = config;
        return `ret_${config}`;
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
    const ret = __module.exports(on, 'first');

    expect(x).to.equal('first');
    expect(ev).to.equal('0_before:browser:launch');
    expect(ret).to.equal('ret_first');
    expect(args).to.equal('0_args');
    expect(getConfig()).to.eql({batchId: 0});

    const ret2 = __module.exports(on, 'second');
    expect(x).to.equal('second');
    expect(ev).to.equal('1_before:browser:launch');
    expect(ret2).to.equal('ret_second');
    expect(args).to.equal('1_args');
    expect(getConfig()).to.eql({batchId: 1});
  });

  it('sets eyes port', () => {
    const __module = {exports: () => {}};
    const {getEyesPort} = pluginExport(__module, {port: 1234});
    expect(getEyesPort()).to.equal(1234);
  });
});
