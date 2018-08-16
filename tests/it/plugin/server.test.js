'use strict';
const {describe, it, afterEach} = require('mocha');
const {expect} = require('chai');
const fetch = require('node-fetch');

const pluginPath = '../../../src/cypress/plugin';

describe('plugin server', () => {
  const __module = {exports: () => {}};
  afterEach(() => {
    delete require.cache[require.resolve(`${pluginPath}`)];
    delete require.cache[require.resolve(`${pluginPath}/server`)];
  });

  it('starts at a random port', async () => {
    const {getEyesPort, closeEyes} = require(pluginPath)(__module);
    const port = await getEyesPort();
    const resp = await fetch(`http://localhost:${port}/hb`);
    expect(resp.status).to.equal(200);
    await closeEyes();
  });
});
