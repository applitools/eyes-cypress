'use strict';
const {describe, it, beforeEach, afterEach} = require('mocha');
const {expect} = require('chai');
const {initConfig, toEnvVarName} = require('../../../src/cypress/plugin/config');
const {resolve} = require('path');
const omit = require('lodash.omit');

function configWithoutBatch(config) {
  return omit(config, ['batchName', 'batchId']);
}

describe('config', () => {
  let getConfig, prevEnv;
  const configPath = resolve(__dirname, 'fixtures');
  beforeEach(() => {
    prevEnv = process.env;
    process.env = {};
    getConfig = initConfig(configPath);
  });

  afterEach(() => {
    process.env = prevEnv;
  });

  it('loads default config', () => {
    const config = getConfig();
    const expectedConfig = {saveDebugData: true, apiKey: 'default api key'};
    expect(configWithoutBatch(config)).to.eql(expectedConfig);
  });

  it('merges args with default config', () => {
    const args = {url: 'some url'};
    const config = getConfig(args);
    const expectedConfig = {url: 'some url', saveDebugData: true, apiKey: 'default api key'};
    expect(configWithoutBatch(config)).to.eql(expectedConfig);
  });

  it('merges with env variables', () => {
    const args = {url: 'some url'};
    process.env.APPLITOOLS_API_KEY = 'env api key';
    getConfig = initConfig(configPath);
    const config = getConfig(args);
    const expectedConfig = {url: 'some url', apiKey: 'env api key', saveDebugData: true};
    expect(configWithoutBatch(config)).to.eql(expectedConfig);
  });

  it('initializes batch info', () => {
    const config = getConfig();
    const {batchName, batchId} = config;
    expect(batchId).not.to.equal(undefined);
    const expectedConfig = Object.assign(
      {saveDebugData: true, apiKey: 'default api key'},
      {batchName, batchId},
    );
    expect(config).to.eql(expectedConfig);
  });

  it('initializes batch info considering env variables', () => {
    process.env.APPLITOOLS_BATCH_NAME = 'env batch name';
    process.env.APPLITOOLS_BATCH_ID = 'env batch id';
    getConfig = initConfig(configPath);
    const config = getConfig();
    const expectedConfig = Object.assign(
      {saveDebugData: true, apiKey: 'default api key'},
      {batchName: process.env.APPLITOOLS_BATCH_NAME, batchId: process.env.APPLITOOLS_BATCH_ID},
    );
    expect(config).to.eql(expectedConfig);
  });

  // this should be removed. This functionality can be achieved by destructuring arguments to openEyes
  it.skip("doesn't insert unknown properties to config", () => {
    const args = {somethingThatDoesntExist: 'something'};
    const config = getConfig(args);
    const expectedConfig = {saveDebugData: true};
    expect(config).to.eql(expectedConfig);
  });
});

describe('toEnvVarName', () => {
  it('works', () => {
    expect(toEnvVarName('someCamelCase')).to.equal('SOME_CAMEL_CASE');
    expect(toEnvVarName('CapitalSomeCamelCase')).to.equal('CAPITAL_SOME_CAMEL_CASE');
  });
});
