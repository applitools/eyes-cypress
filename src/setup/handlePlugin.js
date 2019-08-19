'use strict';

const {readFileSync, writeFileSync} = require('fs');
const chalk = require('chalk');
const addEyesCypressPlugin = require('./addEyesCypressPlugin');
const isPluginDefined = require('./isPluginDefined');
const getFilePath = require('./getFilePath');
const getCypressConfig = require('./getCypressConfig');

function handlePlugin(cwd) {
  const cypressConfig = getCypressConfig(cwd);
  const pluginsFilePath = getFilePath('plugins', cypressConfig, cwd);
  const pluginsFileContent = readFileSync(pluginsFilePath).toString();

  if (!isPluginDefined(pluginsFileContent)) {
    writeFileSync(pluginsFilePath, addEyesCypressPlugin(pluginsFileContent));
    console.log(chalk.cyan('Plugins set'));
  }
}

module.exports = handlePlugin;
