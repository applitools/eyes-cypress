'use strict';

const {readFileSync, writeFileSync} = require('fs');

const addEyesCommands = require('./addEyesCommands');
const isCommandsDefined = require('./isCommandsDefined');
const getCommandsFilePath = require('./getCommandsFilePath');
const getCypressConfig = require('./getCypressConfig');

function handleCommands(cwd) {
  const cypressConfig = getCypressConfig(cwd);
  const commandsFilePath = getCommandsFilePath(cypressConfig, cwd);
  const commandsFileContent = readFileSync(commandsFilePath).toString();

  if (isCommandsDefined(commandsFileContent)) {
    console.log('Eyes.Cypress commands already configured properly. Yay :)');
  } else {
    writeFileSync(commandsFilePath, addEyesCommands(commandsFileContent));
  }
}

module.exports = handleCommands;
