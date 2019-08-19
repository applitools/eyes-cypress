'use strict';

const {resolve, join} = require('path');

function getFilePath(type, cypressConfig, cwd) {
  let filePath = {
    plugins: join('cypress', 'plugins', 'index.js'),
    support: join('cypress', 'support', 'index.js'),
    typeScript: join('cypress', 'support', 'eyes-index.d.ts'),
  }[type];
  filePath = (cypressConfig && cypressConfig[`${type}File`]) || filePath;
  return resolve(cwd, filePath);
}

module.exports = getFilePath;
