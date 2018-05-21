'use strict';
const {describe, it, before, after} = require('mocha');
const {exec} = require('child_process');
const {promisify: p} = require('util');
const {resolve} = require('path');

require('dotenv').config(); // TODO can this be removed because the plugin already does this?

const pexec = p(exec);

const rootPath = resolve(__dirname, '../..');
const testAppPath = resolve(__dirname, '../fixtures/testApp');

describe('cypress run', () => {
  let buff;

  before(async () => {
    process.chdir(testAppPath);
    buff = await pexec(`npm install ${resolve(rootPath, 'node_modules/cypress')}`);
    console.log(buff.stdout);
  });

  after(async () => {
    process.chdir(testAppPath);
    await pexec(
      `rm -rf node_modules cypress/videos cypress/screenshots cypress/fixtures package-lock.json`,
    );
  });

  it('works', async () => {
    try {
      buff = await pexec(
        './node_modules/.bin/cypress run --config integrationFolder=cypress/integration-run,pluginsFile=cypress/plugins/index-run.js,supportFile=cypress/support/index-run.js',
      );
      console.log(buff.stdout);
    } catch (ex) {
      console.error('bla bla', ex.stdout);
      throw ex;
    }
  });

  it('considers timeout passed to checkWindow', async () => {
    try {
      buff = await pexec(
        './node_modules/.bin/cypress run --config integrationFolder=cypress/integration-timeout,pluginsFile=cypress/plugins/index-run.js,supportFile=cypress/support/index-run.js',
      );
      console.log(buff.stdout);
      throw new Error('should have timed out');
    } catch (ex) {
      console.error('bla bla', ex.stdout);
      // Don't throw error
    }
  });
});
