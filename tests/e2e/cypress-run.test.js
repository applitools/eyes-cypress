'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const {exec} = require('child_process');
const {promisify: p} = require('util');
const {resolve} = require('path');
const {TIMEOUT_MSG} = require('../../src/plugin/handlers');

const pexec = p(exec);

const rootPath = resolve(__dirname, '../..');
const testAppPath = resolve(__dirname, '../fixtures/testApp');

describe('cypress run', () => {
  before(async () => {
    process.chdir(testAppPath);
    await pexec(`npm install ${resolve(rootPath, 'node_modules/cypress')}`, {
      maxBuffer: 1000000,
    });
  });

  after(async () => {
    process.chdir(testAppPath);
    await pexec(
      `rm -rf node_modules cypress/videos cypress/screenshots cypress/fixtures package-lock.json`,
      {
        maxBuffer: 1000000,
      },
    );
    process.chdir(rootPath);
  });

  it('works', async () => {
    try {
      await pexec(
        './node_modules/.bin/cypress run --config integrationFolder=cypress/integration-run,pluginsFile=cypress/plugins/index-run.js,supportFile=cypress/support/index-run.js',
        {
          maxBuffer: 10000000,
        },
      );
    } catch (ex) {
      console.error('Error during test!', ex.stdout);
      throw ex;
    }
  });

  it('considers timeout passed to close', async () => {
    try {
      await pexec(
        './node_modules/.bin/cypress run --config integrationFolder=cypress/integration-timeout,pluginsFile=cypress/plugins/index-run.js,supportFile=cypress/support/index-run.js',
        {
          maxBuffer: 10000000,
        },
      );
    } catch (ex) {
      expect(ex.stdout).to.include(TIMEOUT_MSG(100));
    }
  });
});
