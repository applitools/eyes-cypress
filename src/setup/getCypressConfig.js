'use strict';

const {readFileSync} = require('fs');
const {resolve} = require('path');

function getCypressConfig(cwd) {
  const cypressConfigPath = resolve(cwd, 'cypress.json');
  try {
    return JSON.parse(readFileSync(cypressConfigPath));
  } catch (ex) {
    console.log('cypress.json not found at ', cypressConfigPath);
  }
}

module.exports = getCypressConfig;
