'use strict';
const {describe, it, before, after} = require('mocha');
const {expect} = require('chai');
const puppeteer = require('puppeteer');
const _extractResources = require('../../../src/render-grid/browser-util/extractResources');

const extractResources = new Function(`return (${_extractResources})(document.documentElement)`);

describe('extractResources', () => {
  let browser, page;
  before(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
  });

  after(async () => {
    await browser.close();
  });

  it('works for img', async () => {
    const htmlStr = `<body>
        <div style="color:red;">hello</div><img src="https://is2-ssl.mzstatic.com/image/thumb/Video117/v4/15/c8/06/15c8063f-c4c7-c6dd-d531-5b2814ddc634/source/227x227bb.jpg">
    </body>`;

    await page.goto(`data:text/html,${htmlStr}`);

    const expected = [
      'https://is2-ssl.mzstatic.com/image/thumb/Video117/v4/15/c8/06/15c8063f-c4c7-c6dd-d531-5b2814ddc634/source/227x227bb.jpg',
    ];

    const resourceUrls = await page.evaluate(extractResources);
    expect(resourceUrls).to.deep.equal(expected);
  });

  it('works for css', async () => {
    const htmlStr = `<head>
      <link href="http://link/to/css" rel="stylesheet" />
    </head>
    <body>
      <div class='red'>hello</div>
    </body>`;
    const expected = ['http://link/to/css'];

    await page.goto(`data:text/html,${htmlStr}`);
    const resourceUrls = await page.evaluate(extractResources);
    expect(resourceUrls).to.deep.equal(expected);
  });

  it("doesn't send scripts", async () => {
    const htmlStr = `<head>
      <script>console.log('something that should not be included')</script>
      <script src="relative/path/to.js"/>
    </head>
    <body>
      <div class='red'>hello</div>
    </body>`;
    const expected = [];

    await page.goto(`data:text/html,${htmlStr}`);
    const resourceUrls = await page.evaluate(extractResources);
    expect(resourceUrls).to.deep.equal(expected);
  });

  it('works for video', async () => {
    const htmlStr = `
      <video poster="/path/to/poster.jpg">
        <source src="/path/to/video.mp4" type="video/mp4">
      </video>`;
    const expected = ['/path/to/video.mp4', '/path/to/poster.jpg'];
    await page.goto(`data:text/html,${htmlStr}`);
    const resourceUrls = await page.evaluate(extractResources);
    expect(resourceUrls).to.eql(expected);
  });
});
