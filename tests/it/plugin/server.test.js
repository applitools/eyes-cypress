'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const fetch = require('node-fetch');
const {startServer} = require('../../../src/cypress/plugin/server');

describe('plugin server', () => {
  it('starts at a random port', async () => {
    const {eyesPort, closeServer} = await startServer();
    const resp = await fetch(`http://localhost:${eyesPort}/hb`);
    expect(resp.status).to.equal(200);
    await closeServer();
  });
});
