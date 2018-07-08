'use strict';
const {resolve} = require('path');
const getBatch = require('./getBatch');
const configParams = require('./configParams');
const log = require('./log');

const configFilename = 'eyes.json';

function toEnvVarName(camelCaseStr) {
  return camelCaseStr.replace(/(.)([A-Z])/g, '$1_$2').toUpperCase();
}

function initConfig(configFolder) {
  const configPath = resolve(configFolder, configFilename);
  let defaultConfig = {};
  try {
    defaultConfig = require(configPath);
  } catch (ex) {
    log(`no eyes.json config file found at ${configPath}`);
  }

  const envConfig = {};
  for (const p of configParams) {
    envConfig[p] = process.env[`APPLITOOLS_${toEnvVarName(p)}`];
  }

  for (const p in envConfig) {
    if (envConfig[p] === undefined) delete envConfig[p];
  }

  const priorConfig = Object.assign({}, defaultConfig, envConfig);
  Object.assign(priorConfig, getBatch(priorConfig));

  return config => {
    const ret = Object.assign({}, priorConfig, config);
    log(`running with config: ${JSON.stringify(ret)}`);
    return ret;
  };
}

module.exports = {
  initConfig,
  toEnvVarName,
};
