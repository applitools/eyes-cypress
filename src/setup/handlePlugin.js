'use strict';

const {readFileSync, writeFileSync} = require('fs');

const addEyesCypressPlugin = require('./addEyesCypressPlugin');
const isPluginDefined = require('./isPluginDefined');
const getPluginsFilePath = require('./getPluginsFilePath');
const getCypressConfig = require('./getCypressConfig');

function handlePlugin(cwd) {
  const cypressConfig = getCypressConfig(cwd);
  const pluginsFilePath = getPluginsFilePath(cypressConfig, cwd);
  const pluginsFileContent = readFileSync(pluginsFilePath).toString();

  if (isPluginDefined(pluginsFileContent)) {
    console.log('Eyes.Cypress plugin already configured properly. Yay :)');
  } else {
    writeFileSync(pluginsFilePath, addEyesCypressPlugin(pluginsFileContent));
  }
}

module.exports = handlePlugin;
