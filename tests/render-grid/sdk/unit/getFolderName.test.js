'use strict';

const {describe, it} = require('mocha');
const {expect} = require('chai');
const getFolderName = require('../../../../src/render-grid/troubleshoot/getFolderName');

describe('getFolderName', () => {
  it('works', () => {
    const d = new Date(1981, 2, 22, 12, 31);
    const renderId = 'some-render-id';
    expect(getFolderName(renderId, d)).to.equal('1981-03-22-1231_some-render-id');
  });
});
