'use strict';
const {describe, it, afterEach} = require('mocha');
const {expect} = require('chai');
const fetch = require('node-fetch');
const defaultPort = require('../../../src/cypress/plugin/defaultPort');

const pluginPath = '../../../src/cypress/plugin';

describe('plugin server', () => {
  const __module = {exports: () => {}};
  afterEach(() => {
    delete require.cache[require.resolve(`${pluginPath}`)];
    delete require.cache[require.resolve(`${pluginPath}/server`)];
  });

  it('starts at a default port', async () => {
    const {getEyesPort, closeEyes} = require(pluginPath)(__module);
    const port = await getEyesPort();
    expect(port).to.equal(defaultPort);
    const resp = await fetch(`http://localhost:${port}/hb`);
    expect(resp.status).to.equal(200);
    await closeEyes();
  });

  it('starts at a custom port', async () => {
    const {getEyesPort, closeEyes} = require(pluginPath)(__module, {port: 7374});
    const port = await getEyesPort();
    expect(port).to.equal(7374);
    const resp = await fetch(`http://localhost:${port}/hb`);
    expect(resp.status).to.equal(200);
    await closeEyes();
  });

  it('starts at a random port', async () => {
    const {getEyesPort, closeEyes} = require(pluginPath)(__module, {port: 0});
    const port = await getEyesPort();
    const resp = await fetch(`http://localhost:${port}/hb`);
    expect(resp.status).to.equal(200);
    await closeEyes();
  });
});
