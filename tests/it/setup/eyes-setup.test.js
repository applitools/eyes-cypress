'use strict';

const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const {readFileSync, writeFileSync} = require('fs');
const {resolve} = require('path');
const {pluginRequire} = require('../../../src/setup/addEyesCypressPlugin');
const {commandsImport} = require('../../../src/setup/addEyesCommands');

describe('eyes-setup script', () => {
  let cwd;
  const fixturesPath = resolve(__dirname, 'fixtures');
  const pluginFilePath = resolve(fixturesPath, 'cypress/plugins/index-bla-plugin.js');
  const origPluginFileContent = readFileSync(pluginFilePath).toString();

  const supportFilePath = resolve(fixturesPath, 'cypress/support/index-bla-commands.js');
  const origSupportFileContent = readFileSync(supportFilePath).toString();

  before(() => {
    cwd = process.cwd();
    process.chdir(fixturesPath);
  });

  after(() => {
    process.chdir(cwd);
    writeFileSync(pluginFilePath, origPluginFileContent);
    writeFileSync(supportFilePath, origSupportFileContent);
  });

  it('works', () => {
    require('../../../bin/eyes-setup');

    expect(readFileSync(pluginFilePath).toString()).to.equal(
      origPluginFileContent.replace(/}\n$/, `}\n${pluginRequire}`),
    );

    expect(readFileSync(supportFilePath).toString()).to.equal(
      origSupportFileContent.replace(
        "import './commands'",
        `${commandsImport}\nimport './commands'`,
      ),
    );
  });
});
