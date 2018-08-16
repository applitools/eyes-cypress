'use strict';
const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const makePluginExport = require('../../../src/cypress/plugin/pluginExport');
const {promisify: p} = require('util');
const psetTimeout = p(setTimeout);

describe('pluginExport', () => {
  let pluginExport, prevEnv;

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
    pluginExport = makePluginExport({
      getEyesPort,
      setEyesPort,
    });
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

    const on = (_event, _callback) => {};

    let x;

    pluginExport(__module);
    const ret = await __module.exports(on, 'first');

    expect(x).to.equal('first');
    expect(ret).to.eql({bla: 'ret_first', eyesPort: undefined});

    const ret2 = await __module.exports(on, 'second');
    expect(x).to.equal('second');
    expect(ret2).to.eql({bla: 'ret_second', eyesPort: undefined});
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
