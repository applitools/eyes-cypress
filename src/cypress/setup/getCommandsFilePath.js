'use strict';

const {resolve, join} = require('path');

function getCommandsFilePath(cypressConfig, cwd) {
  let supportFile = join('cypress', 'support', 'index.js');
  supportFile = (cypressConfig && cypressConfig.supportFile) || supportFile;
  return resolve(cwd, supportFile);
}

module.exports = getCommandsFilePath;
