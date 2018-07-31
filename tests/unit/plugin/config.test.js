'use strict';
const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const {initConfig, toEnvVarName} = require('../../../src/cypress/plugin/config');
const {resolve} = require('path');

describe('config', () => {
  let prevEnv;
  const configPath = resolve(__dirname, 'fixtures');
  beforeEach(() => {
    prevEnv = process.env;
    process.env = {};
  });

  afterEach(() => {
    process.env = prevEnv;
  });

  it('loads default config from file', () => {
    const {getConfig} = initConfig(configPath);
    const config = getConfig();
    const expectedConfig = {saveDebugData: true, apiKey: 'default api key'};
    expect(config).to.eql(expectedConfig);
  });

  it('merges args with default config', () => {
    const {getConfig} = initConfig();
    const config = getConfig({url: 'some url'});
    const expectedConfig = {url: 'some url'};
    expect(config).to.eql(expectedConfig);
  });

  it('merges with env variables', () => {
    process.env.APPLITOOLS_API_KEY = 'env api key';
    const {getConfig} = initConfig(configPath);
    const config = getConfig({url: 'some url'});
    const expectedConfig = {url: 'some url', apiKey: 'env api key', saveDebugData: true};
    expect(config).to.eql(expectedConfig);
  });

  it('updateConfig works', () => {
    const {getConfig, updateConfig} = initConfig();
    updateConfig({some: 'thing'});
    expect(getConfig()).to.eql({some: 'thing'});
  });

  it('getInitialConfig works', () => {
    const {getConfig, updateConfig, getInitialConfig} = initConfig(configPath);
    expect(getConfig()).to.eql({apiKey: 'default api key', saveDebugData: true});
    updateConfig({some: 'thing', apiKey: 'overriden'});
    expect(getConfig()).to.eql({some: 'thing', apiKey: 'overriden', saveDebugData: true});
    expect(getInitialConfig()).to.eql({apiKey: 'default api key', saveDebugData: true});
  });
});

describe('toEnvVarName', () => {
  it('works', () => {
    expect(toEnvVarName('someCamelCase')).to.equal('SOME_CAMEL_CASE');
    expect(toEnvVarName('CapitalSomeCamelCase')).to.equal('CAPITAL_SOME_CAMEL_CASE');
  });
});
