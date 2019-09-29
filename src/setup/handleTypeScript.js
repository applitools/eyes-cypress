'use strict';
const chalk = require('chalk');
const {writeFileSync, existsSync} = require('fs');
const getFilePath = require('./getFilePath');
const getCypressConfig = require('./getCypressConfig');

function handleTypeScript(cwd) {
  const cypressConfig = getCypressConfig(cwd);
  const typeScriptFilePath = getFilePath('typeScript', cypressConfig, cwd);
  const eyesIndexContent = `import "@applitools/eyes-cypress"`;

  if (!existsSync(typeScriptFilePath)) {
    writeFileSync(typeScriptFilePath, eyesIndexContent);
    console.log(chalk.cyan('Typescript set'));
  }
}

module.exports = handleTypeScript;
