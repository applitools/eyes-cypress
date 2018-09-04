'use strict';

const {resolve, join} = require('path');

function getPluginsFilePath(cypressConfig, cwd) {
  let pluginsFile = join('cypress', 'plugins', 'index.js');
  pluginsFile = (cypressConfig && cypressConfig.pluginsFile) || pluginsFile;
  return resolve(cwd, pluginsFile);
}

module.exports = getPluginsFilePath;
