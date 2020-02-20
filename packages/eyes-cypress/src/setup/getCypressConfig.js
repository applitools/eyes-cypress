'use strict';

const {readFileSync} = require('fs');
const {resolve} = require('path');
const chalk = require('chalk');

function getCypressConfig(cwd) {
  const cypressConfigPath = resolve(cwd, 'cypress.json');
  try {
    return JSON.parse(readFileSync(cypressConfigPath));
  } catch (ex) {
    console.log(chalk.red('cypress.json not found at ', cypressConfigPath));
  }
}

module.exports = getCypressConfig;
