'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const testLogger = require('../../../util/testLogger');
const makeExtractCssResources = require('../../../../src/render-grid/sdk/extractCssResources');

describe('extractCssResources', () => {
  const extractCssResources = makeExtractCssResources(testLogger);

  it('supports property url()', () => {
    const cssText = `
      .selector { background: url('hello.jpg'); }
      .selector2 { background-image: url("hello2.jpg"); }
      .selector3 { background: url("http://other/hello3.jpg"); }
    `;
    const baseUrl = 'http://some/path';
    const resourceUrls = extractCssResources(cssText, baseUrl);
    expect(resourceUrls).to.eql([
      'http://some/hello.jpg',
      'http://some/hello2.jpg',
      'http://other/hello3.jpg',
    ]);
  });

  it('supports @font-face rule', () => {
    const cssText = `@font-face {
      font-family: 'Zilla Slab';
      font-style: normal;
      font-weight: 400;
      src: local('Zilla Slab'), local('ZillaSlab-Regular'), url('zilla_slab.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }`;
    const baseUrl = 'http://some/path';
    const resourceUrls = extractCssResources(cssText, baseUrl);
    expect(resourceUrls).to.eql(['http://some/zilla_slab.woff2']);
  });

  it('supports @import rule', () => {
    const cssText = `@import 'some.css';`;
    const baseUrl = 'http://some/path';
    const resourceUrls = extractCssResources(cssText, baseUrl);
    expect(resourceUrls).to.eql(['http://some/some.css']);
  });

  it('supports @support rule', () => {
    const cssText = `@supports (display: grid) {
      div {
        display: grid;
        background: url('hello.jpg');
      }
    }`;
    const baseUrl = 'http://some/path';
    const resourceUrls = extractCssResources(cssText, baseUrl);
    expect(resourceUrls).to.eql(['http://some/hello.jpg']);
  });

  it("doesn't crash on parse error", () => {
    const cssText = `something that doesn't get parsed`;
    const baseUrl = 'http://some/path';
    const resourceUrls = extractCssResources(cssText, baseUrl);
    expect(resourceUrls).to.eql([]);
  });

  it('supports resources inside @media queries', () => {
    const cssText = `@media (max-width:991px) {
      .bla {
        background: url('hello.jpg');
      }
    }`;
    const baseUrl = 'http://some/path';
    const resourceUrls = extractCssResources(cssText, baseUrl);
    expect(resourceUrls).to.eql(['http://some/hello.jpg']);
  });

  it('supports multiple src properties in @font-face rules', () => {
    const cssText = `
   @font-face {
     font-family: 'FontAwesome';
     src: url('//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.eot');
     src: url('//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.eot?#iefix') format('embedded-opentype'),
          url('//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.woff2') format('woff2'),
          url('//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.woff') format('woff'),
          url('//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.ttf') format('truetype'),
          url('//use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.svg#fontawesomeregular') format('svg');
     font-weight: normal;
     font-style: normal;
   }`;

    // NOTE: the first src property will be overriden by the second one. That's fine. We don't want to support that use case since this type of definition is meant
    // to provide support for older browsers. The first `src` will be read by older browsers, and the second one for modern ones. We're working on modern ones.

    const baseUrl = 'http://some/path';
    const resourceUrls = extractCssResources(cssText, baseUrl);
    expect(resourceUrls).to.eql([
      'http://use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.eot?#iefix',
      'http://use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.woff2',
      'http://use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.woff',
      'http://use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.ttf',
      'http://use.fontawesome.com/releases/v4.7.0/fonts/fontawesome-webfont.svg#fontawesomeregular',
    ]);
  });
});
