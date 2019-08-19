'use strict';

const chalk = require('chalk');
const {readFileSync, writeFileSync} = require('fs');
const addEyesCommands = require('./addEyesCommands');
const isCommandsDefined = require('./isCommandsDefined');
const getFilePath = require('./getFilePath');
const getCypressConfig = require('./getCypressConfig');

function handleCommands(cwd) {
  const cypressConfig = getCypressConfig(cwd);
  const commandsFilePath = getFilePath('support', cypressConfig, cwd);
  const commandsFileContent = readFileSync(commandsFilePath).toString();

  if (!isCommandsDefined(commandsFileContent)) {
    writeFileSync(commandsFilePath, addEyesCommands(commandsFileContent));
    console.log(chalk.cyan('Commnads set'));
  }
}

module.exports = handleCommands;
