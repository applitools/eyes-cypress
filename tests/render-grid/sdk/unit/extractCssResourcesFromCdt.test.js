'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const {loadJsonFixture} = require('../../../util/loadFixture');
const extractCssResourcesFromCdt = require('../../../../src/render-grid/sdk/extractCssResourcesFromCdt');

describe('extractCssResourcesFromCdt', () => {
  it('works', async () => {
    const cdt = loadJsonFixture('test.cdt.json');
    const resourceUrls = extractCssResourcesFromCdt(cdt, 'http://some/url');
    expect(resourceUrls).to.eql(['http://some/imported2.css']);
  });
});
