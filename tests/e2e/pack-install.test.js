const {describe, it, after} = require('mocha');
const {exec} = require('child_process');
const {resolve} = require('path');
const {promisify: p} = require('util');

require('dotenv').config();
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
  });

  it('installs and runs properly', async () => {
    const {name, version} = rootPackageJson;
    const packageName = name
      .split('/')
      .map(x => x.replace('@', ''))
      .join('-');
    packageFilePath = resolve(rootPath, `${packageName}-${version}.tgz`);
    let buff = await pexec(`npm pack ${rootPath}`);
    console.log(buff.stdout);
    process.chdir(testAppPath);
    buff = await pexec(`npm install ${resolve(rootPath, 'node_modules/cypress')}`);
    console.log(buff.stdout);
    buff = await pexec(`npm install ${packageFilePath}`);
    console.log(buff.stdout);

    // TODO remove this when PR is merged
    buff = await pexec(
      `cp ${resolve(
        rootPath,
        'node_modules/@applitools/eyes.sdk.core/lib/server/ServerConnector.js',
      )} ${resolve(
        testAppPath,
        'node_modules/@applitools/eyes.sdk.core/lib/server/ServerConnector.js',
      )}`,
    );

    try {
      buff = await pexec('./node_modules/.bin/cypress run');
      console.log(buff.stdout);
    } catch (ex) {
      console.error('bla bla', ex.stdout);
      throw ex;
    }
  });
});
