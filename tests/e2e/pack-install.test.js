'use strict';
const {describe, it, after} = require('mocha');
const {exec} = require('child_process');
const {resolve} = require('path');
const {promisify: p} = require('util');
const {readFileSync, writeFileSync} = require('fs');

const rootPath = resolve(__dirname, '../..');
const rootPackageJson = require(resolve(rootPath, 'package.json'));
const testAppPath = resolve(__dirname, '../fixtures/testApp');
const pexec = p(exec);

describe('package and install', () => {
  let packageFilePath;
  after(async () => {
    process.chdir(testAppPath);
    await pexec(
      `rm -rf node_modules cypress/videos cypress/screenshots cypress/fixtures ${packageFilePath} package-lock.json`,
    );
    const packageJson = JSON.parse(readFileSync('package.json').toString());
    delete packageJson.dependencies['@applitools/eyes-cypress'];
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2));
  });

  it('installs and runs properly', async () => {
    const {name, version} = rootPackageJson;
    const packageName = name
      .split('/')
      .map(x => x.replace('@', ''))
      .join('-');
    packageFilePath = resolve(rootPath, `${packageName}-${version}.tgz`);
    await pexec(`npm pack ${rootPath}`);
    process.chdir(testAppPath);
    await pexec(`npm install ${resolve(rootPath, 'node_modules/cypress')}`);
    await pexec(`npm install ${packageFilePath}`);

    try {
      await pexec(
        './node_modules/.bin/cypress run --config integrationFolder=cypress/integration-pack,pluginsFile=cypress/plugins/index-pack.js,supportFile=cypress/support/index-pack.js',
        {maxBuffer: 10000000},
      );
    } catch (ex) {
      console.error('Error!', ex.stdout);
      throw ex;
    }
  });
});
