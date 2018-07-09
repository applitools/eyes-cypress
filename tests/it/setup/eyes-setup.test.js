'use strict';

const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const {readFileSync, writeFileSync} = require('fs');
const {resolve} = require('path');
const {pluginRequire} = require('../../../src/cypress/setup/addEyesCypressPlugin');

describe('eyes-setup script', () => {
  let cwd;
  const fixturesPath = resolve(__dirname, 'fixtures');
  const pluginFilePath = resolve(fixturesPath, 'cypress/plugins/index-bla.js');
  const origFileContent = readFileSync(pluginFilePath);

  before(() => {
    cwd = process.cwd();
    process.chdir(fixturesPath);
  });

  after(() => {
    process.chdir(cwd);
    writeFileSync(pluginFilePath, origFileContent);
  });

  it('works', () => {
    const pluginFileContent = readFileSync(pluginFilePath).toString();
    require('../../../bin/eyes-setup');

    expect(readFileSync(pluginFilePath).toString()).to.equal(
      pluginFileContent.replace(
        "const _fs = require('fs');",
        `${pluginRequire}\nconst _fs = require('fs');`,
      ),
    );
  });
});
