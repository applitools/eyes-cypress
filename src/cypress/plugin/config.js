'use strict';
const {resolve} = require('path');
const getBatch = require('./getBatch');

const configFilename = 'eyes.json';

function initConfig(configFolder) {
  const configPath = resolve(configFolder, configFilename);
  let defaultConfig = {};
  try {
    defaultConfig = require(configPath);
  } catch (ex) {
    console.log(`no eyes.json config file found at ${configPath}`);
  }

  const envConfig = {
    apiKey: process.env.APPLITOOLS_API_KEY,
  };

  for (const p in envConfig) {
    if (envConfig[p] === undefined) delete envConfig[p];
  }

  const priorConfig = Object.assign({}, defaultConfig, envConfig);
  Object.assign(priorConfig, getBatch(priorConfig));

  return config => {
    return Object.assign({}, priorConfig, config);
  };
}

module.exports = {
  initConfig,
};
