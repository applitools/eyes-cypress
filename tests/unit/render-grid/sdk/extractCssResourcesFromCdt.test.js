'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const {loadJsonFixture} = require('../../../util/loadFixture');
const makeExtractCssResources = require('../../../../src/render-grid/sdk/extractCssResources');
const makeExtractCssResourcesFromCdt = require('../../../../src/render-grid/sdk/extractCssResourcesFromCdt');
const testLogger = require('../../../util/testLogger');

describe('extractCssResourcesFromCdt', () => {
  const extractCssResources = makeExtractCssResources(testLogger);
  const extractCssResourcesFromCdt = makeExtractCssResourcesFromCdt(extractCssResources);

  it('works', () => {
    const cdt = loadJsonFixture('test.cdt.json');
    const resourceUrls = extractCssResourcesFromCdt(cdt, 'http://some/url');
    expect(resourceUrls).to.eql(['http://some/imported2.css']);
  });

  it('supports resources in style attributes', () => {
    const cdt = [
      {
        nodeType: 9,
        childNodeIndexes: [1],
      },
      {
        nodeType: 1,
        nodeName: 'HTML',
        attributes: [],
        childNodeIndexes: [2],
      },
      {
        nodeType: 1,
        nodeName: 'BODY',
        attributes: [],
        childNodeIndexes: [3],
      },
      {
        nodeType: 1,
        nodeName: 'DIV',
        attributes: [
          {
            name: 'style',
            value:
              'position: absolute; z-index: 0; cursor: url("https://maps.gstatic.com/mapfiles/openhand_8_8.cur"), default; left: 0px; top: 0px; height: 100%; width: 100%; padding: 0px; border-width: 0px; margin: 0px; touch-action: pan-x pan-y;',
          },
        ],
        childNodeIndexes: [3],
      },
    ];

    const resourceUrls = extractCssResourcesFromCdt(cdt, 'http://some/url');
    expect(resourceUrls).to.eql(['https://maps.gstatic.com/mapfiles/openhand_8_8.cur']);
  });
});
