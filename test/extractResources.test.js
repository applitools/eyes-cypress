const {expect} = require('chai');
const {JSDOM} = require('jsdom');
const extractResources = require('../src/extractResources');

const test = (name, htmlStr, expected) =>
  it(name, () => {
    const jsdom = new JSDOM(htmlStr);
    const resourceUrls = extractResources([jsdom.window.document.documentElement]);
    expect(resourceUrls).to.deep.equal(expected);
  });

describe('extractResources', () => {
  test(
    'works for img',
    `<body>
        <div style="color:red;">hello</div><img src="https://is2-ssl.mzstatic.com/image/thumb/Video117/v4/15/c8/06/15c8063f-c4c7-c6dd-d531-5b2814ddc634/source/227x227bb.jpg">
    </body>`,
    [
      'https://is2-ssl.mzstatic.com/image/thumb/Video117/v4/15/c8/06/15c8063f-c4c7-c6dd-d531-5b2814ddc634/source/227x227bb.jpg',
    ],
  );

  test(
    'works for css',
    `<head>
      <link href="http://link/to/css" rel="stylesheet" />
    </head>
    <body>
      <div class='red'>hello</div>
    </body>`,
    ['http://link/to/css'],
  );
});
