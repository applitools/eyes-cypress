'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const getPluginsFilePath = require('../../../src/setup/getPluginsFilePath');

describe('getPluginsFilePath', () => {
  it('handles null config', () => {
    const cwd = '/some/path';
    expect(getPluginsFilePath(null, cwd)).to.equal(`${cwd}/cypress/plugins/index.js`);
  });

  it('handles config without pluginsFile entry', () => {
    const cwd = '/some/path';
    expect(getPluginsFilePath({}, cwd)).to.equal(`${cwd}/cypress/plugins/index.js`);
  });

  it('handles config WITH pluginsFile entry', () => {
    const cwd = '/some/path';
    expect(getPluginsFilePath({pluginsFile: 'other/place/bla.js'}, cwd)).to.equal(
      `${cwd}/other/place/bla.js`,
    );
  });
});
