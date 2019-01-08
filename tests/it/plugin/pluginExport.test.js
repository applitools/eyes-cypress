'use strict';
const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const makePluginExport = require('../../../src/plugin/pluginExport');
const {promisify: p} = require('util');
const psetTimeout = p(setTimeout);

describe('pluginExport', () => {
  let pluginExport, prevEnv;
  const config = {};

  async function startServer() {
    return {
      eyesPort: 123,
    };
  }

  beforeEach(() => {
    prevEnv = process.env;
    process.env = {};
    pluginExport = makePluginExport({startServer, config});
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
    expect(ret).to.eql({bla: 'ret_first', eyesPort: 123, eyesIsDisabled: false});

    const ret2 = await __module.exports(on, 'second');
    expect(x).to.equal('second');
    expect(ret2).to.eql({bla: 'ret_second', eyesPort: 123, eyesIsDisabled: false});
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
    expect(ret).to.eql({bla: 'bla', eyesPort: 123, eyesIsDisabled: false});
  });

  describe('with eyes disabled', () => {
    before(() => (config.isDisabled = true));

    after(() => delete config.isDisabled);

    it('works with disabled eyes', async () => {
      const __module = {
        exports: () => ({bla: 'ret'}),
      };

      pluginExport(__module);
      const ret = await __module.exports();
      expect(ret).to.eql({bla: 'ret', eyesPort: 123, eyesIsDisabled: true});
    });
  });
});
