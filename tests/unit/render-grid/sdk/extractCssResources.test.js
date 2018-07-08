'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const testLogger = require('../../../util/testLogger');
const extractCssResources = require('../../../../src/render-grid/sdk/extractCssResources');

describe('extractCssResources', () => {
  it('supports property url()', async () => {
    const cssText = `
      .selector { background: url('hello.jpg'); }
      .selector2 { background-image: url("hello2.jpg"); }
      .selector3 { background: url("http://other/hello3.jpg"); }
    `;
    const baseUrl = 'http://some/path';
    const resourceUrls = extractCssResources(cssText, baseUrl, testLogger);
    expect(resourceUrls).to.eql([
      'http://some/hello.jpg',
      'http://some/hello2.jpg',
      'http://other/hello3.jpg',
    ]);
  });

  it('supports @font-face rule', async () => {
    const cssText = `@font-face {
      font-family: 'Zilla Slab';
      font-style: normal;
      font-weight: 400;
      src: local('Zilla Slab'), local('ZillaSlab-Regular'), url('zilla_slab.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }`;
    const baseUrl = 'http://some/path';
    const resourceUrls = extractCssResources(cssText, baseUrl, testLogger);
    expect(resourceUrls).to.eql(['http://some/zilla_slab.woff2']);
  });

  it('supports @import rule', async () => {
    const cssText = `@import 'some.css';`;
    const baseUrl = 'http://some/path';
    const resourceUrls = extractCssResources(cssText, baseUrl, testLogger);
    expect(resourceUrls).to.eql(['http://some/some.css']);
  });

  it('supports @support rule', async () => {
    const cssText = `@supports (display: grid) {
      div {
        display: grid;
        background: url('hello.jpg');
      }
    }`;
    const baseUrl = 'http://some/path';
    const resourceUrls = extractCssResources(cssText, baseUrl, testLogger);
    expect(resourceUrls).to.eql(['http://some/hello.jpg']);
  });

  it("doesn't crash on parse error", async () => {
    const cssText = `something that doesn't get parsed`;
    const baseUrl = 'http://some/path';
    const resourceUrls = extractCssResources(cssText, baseUrl, testLogger);
    expect(resourceUrls).to.eql([]);
  });
});
