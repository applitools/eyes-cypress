'use strict';

const {resolve, join, dirname, sep} = require('path');

function getFilePath(type, cypressConfig, cwd) {
  let filePath = {
    plugins: join('cypress', 'plugins', 'index.js'),
    support: join('cypress', 'support', 'index.js'),
    typeScript: join('cypress', 'support', 'eyes-index.d.ts'),
  }[type];
  filePath = (cypressConfig && cypressConfig[`${type}File`]) || filePath;

  if (type === 'typeScript' && cypressConfig && cypressConfig[`supportFile`]) {
    const supportDir = dirname(cypressConfig[`supportFile`])
      .split(sep)
      .pop();
    filePath = resolve(supportDir, 'eyes-index.d.ts');
  }

  return resolve(cwd, filePath);
}

module.exports = getFilePath;
