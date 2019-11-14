'use strict';

const {resolve, join, dirname} = require('path');

function getFilePath(type, cypressConfig, cwd) {
  let filePath = {
    plugins: join('cypress', 'plugins', 'index.js'),
    support: join('cypress', 'support', 'index.js'),
    typeScript: join('cypress', 'support', 'eyes-index.d.ts'),
  }[type];

  if (type === 'typeScript' && cypressConfig && cypressConfig[`supportFile`]) {
    const supportDir = dirname(cypressConfig[`supportFile`]);
    filePath = resolve(supportDir, 'eyes-index.d.ts');
  }

  filePath = (cypressConfig && cypressConfig[`${type}File`]) || filePath;

  return resolve(cwd, filePath);
}

module.exports = getFilePath;
