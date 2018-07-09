#!/usr/bin/env node
'use strict';

const {readFileSync, writeFileSync} = require('fs');
const addEyesCypressPlugin = require('../src/cypress/setup/addEyesCypressPlugin');
const isPluginDefined = require('../src/cypress/setup/isPluginDefined');
const getPluginsFilePath = require('../src/cypress/setup/getPluginsFilePath');
const getCypressConfig = require('../src/cypress/setup/getCypressConfig');

const cwd = process.cwd();

const cypressConfig = getCypressConfig(cwd);
const pluginsFilePath = getPluginsFilePath(cypressConfig, cwd);
const pluginsFileContent = readFileSync(pluginsFilePath).toString();

if (isPluginDefined(pluginsFileContent)) {
  console.log('Eyes.Cypress plugin already configured properly. Yay :)');
} else {
  writeFileSync(pluginsFilePath, addEyesCypressPlugin(pluginsFileContent));
}

console.log('Done!');
