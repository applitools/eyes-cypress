'use strict';
const {describe, it, before, after, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const fetch = require('../../util/fetchWithNoCAVerify');
let startPlugin = require('../../../src/plugin/startPlugin');

describe('start plugin', () => {
  let getCloseServer, __module;

  beforeEach(() => {
    __module = {exports: () => {}};
    getCloseServer = startPlugin(__module);
  });

  afterEach(async () => {
    __module = null;
    await getCloseServer()();
  });

  it('starts plugin server and patches module exports', async () => {
    const {eyesPort} = await __module.exports();
    const resp = await fetch(`https://localhost:${eyesPort}/hb`);
    expect(resp.status).to.equal(200);
  });

  it('patches module exports with correct pref', async () => {
    const {eyesIsDisabled, eyesDontFailOnDiff} = await __module.exports();
    expect(eyesIsDisabled).to.be.false;
    expect(eyesDontFailOnDiff).to.be.false;
  });

  describe('with eyes disabled', () => {
    before(() => {
      process.env['APPLITOOLS_IS_DISABLED'] = true;
      delete require.cache[require.resolve('../../../src/plugin/startPlugin')];
      startPlugin = require('../../../src/plugin/startPlugin');
    });

    beforeEach(() => {
      __module = {exports: () => {}};
      getCloseServer = startPlugin(__module);
    });

    after(() => {
      delete process.env['APPLITOOLS_IS_DISABLED'];
      delete require.cache[require.resolve('../../../src/plugin/startPlugin')];
    });

    it('patches module exports with disabled eyes pref', async () => {
      const {eyesIsDisabled} = await __module.exports();
      expect(eyesIsDisabled).to.be.true;
    });
  });

  describe('with eyes dont fail on diff', () => {
    before(() => {
      process.env['APPLITOOLS_DONT_FAIL_ON_DIFF'] = true;
      delete require.cache[require.resolve('../../../src/plugin/startPlugin')];
      startPlugin = require('../../../src/plugin/startPlugin');
    });

    beforeEach(() => {
      __module = {exports: () => {}};
      getCloseServer = startPlugin(__module);
    });

    after(() => {
      delete process.env['APPLITOOLS_DONT_FAIL_ON_DIFF'];
      delete require.cache[require.resolve('../../../src/plugin/startPlugin')];
    });

    it('patches module exports with dont fail pref', async () => {
      const {eyesDontFailOnDiff} = await __module.exports();
      expect(eyesDontFailOnDiff).to.be.true;
    });
  });
});
