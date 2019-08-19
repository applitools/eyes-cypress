#!/usr/bin/env node
'use strict';

const chalk = require('chalk');
const handlePlugin = require('../src/setup/handlePlugin');
const handleCommands = require('../src/setup/handleCommands');
const handleTypeScript = require('../src/setup/handleTypeScript');
const {version} = require('../package');
const cwd = process.cwd();

console.log(chalk.cyan('Setup eyes-cypress', version));

handlePlugin(cwd);
handleCommands(cwd);
handleTypeScript(cwd);

console.log(chalk.cyan('Setup done!'));
