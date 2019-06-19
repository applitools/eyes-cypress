#!/usr/bin/env node
'use strict';

const handlePlugin = require('../src/setup/handlePlugin');
const handleCommands = require('../src/setup/handleCommands');

const cwd = process.cwd();

console.log('Setup eyes-cypress');

handlePlugin(cwd);
handleCommands(cwd);

console.log('Done!');
