'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const fetch = require('node-fetch');
const startPlugin = require('../../../src/plugin/startPlugin');

describe('start plugin', () => {
  it('starts plugin server and patches module exports', async () => {
    const __module = {exports: () => {}};
    const getCloseServer = startPlugin(__module);
    const {eyesPort} = await __module.exports();
    const resp = await fetch(`http://localhost:${eyesPort}/hb`);
    expect(resp.status).to.equal(200);
    await getCloseServer()();
  });
});
