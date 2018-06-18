'use strict';
const {resolve} = require('path');

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

  return config => Object.assign({}, defaultConfig, envConfig, config);
}

module.exports = {
  initConfig,
};
