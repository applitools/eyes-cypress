'use strict';
const {describe, it} = require('mocha');

describe('eyes-setup script', () => {
  it('adds code to pluginsFile', () => {
    require('../../bin/eyes-setup');
  });
});
