#!/usr/bin/env node
'use strict';

const handlePlugin = require('../src/cypress/setup/handlePlugin');
const handleCommands = require('../src/cypress/setup/handleCommands');

const cwd = process.cwd();

handlePlugin(cwd);
handleCommands(cwd);

console.log('Done!');
