const {describe, it} = require('mocha');
const {expect} = require('chai');
const {JSDOM} = require('jsdom');
const extractResources = require('../../../src/render-grid/browser-util/extractResources');

describe('extractResources', () => {
  it('works for img', () => {
    const htmlStr = `<body>
        <div style="color:red;">hello</div><img src="https://is2-ssl.mzstatic.com/image/thumb/Video117/v4/15/c8/06/15c8063f-c4c7-c6dd-d531-5b2814ddc634/source/227x227bb.jpg">
    </body>`;
    const expected = [
      'https://is2-ssl.mzstatic.com/image/thumb/Video117/v4/15/c8/06/15c8063f-c4c7-c6dd-d531-5b2814ddc634/source/227x227bb.jpg',
    ];

    const jsdom = new JSDOM(htmlStr);
    const resourceUrls = extractResources(jsdom.window.document.documentElement);
    expect(resourceUrls).to.deep.equal(expected);
  });

  it('works for css', () => {
    const htmlStr = `<head>
      <link href="http://link/to/css" rel="stylesheet" />
    </head>
    <body>
      <div class='red'>hello</div>
    </body>`;
    const expected = ['http://link/to/css'];

    const jsdom = new JSDOM(htmlStr);
    const resourceUrls = extractResources(jsdom.window.document.documentElement);
    expect(resourceUrls).to.deep.equal(expected);
  });

  it("doesn't send scripts", () => {
    const htmlStr = `<head>
      <script>console.log('something that should not be included')</script>
      <script src="relative/path/to.js"/>
    </head>
    <body>
      <div class='red'>hello</div>
    </body>`;
    const expected = [];

    const jsdom = new JSDOM(htmlStr);
    const resourceUrls = extractResources(jsdom.window.document.documentElement);
    expect(resourceUrls).to.deep.equal(expected);
  });

  it.skip('works for resources inside style tag', () => {
    const htmlStr = `<style>@import 'imported2.css'</style>`;
    const expected = [];
    const jsdom = new JSDOM(htmlStr);
    const resourceUrls = extractResources(
      jsdom.window.document.documentElement,
      jsdom.window.location.href,
    );
    expect(resourceUrls).to.deep.equal(expected);
  });

  // TODO
  it.skip('works for font', () => {
    const htmlStr = `<body/>`;
    const expected = [];

    const jsdom = new JSDOM(htmlStr);
    const resourceUrls = extractResources(jsdom.window.document.documentElement);
    expect(resourceUrls).to.deep.equal(expected);
  });
});
