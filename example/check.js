const EyesCypressImpl = require('../src/EyesCypressImpl');
const {RGridDom} = require('@applitools/eyes.sdk.core');
const domNodesToCdt = require('../src/domNodesToCdt');
const {JSDOM} = require('jsdom');
const createRGridDom = require('../src/createRGridDom');

const eyes = new EyesCypressImpl({
  apiKey: process.env.APPLITOOLS_API_KEY,
});

async function createDom() {
  const dom = new JSDOM(
    `<head>
      <link href="http://bashful-waste.surge.sh/test.css" rel="stylesheet" />
    </head>
    <body>
      <div style="color:red;">hi, I'm red</div>
      <div class="blue">We've met already, I'm blue</div>
      <img src="https://is2-ssl.mzstatic.com/image/thumb/Video117/v4/15/c8/06/15c8063f-c4c7-c6dd-d531-5b2814ddc634/source/227x227bb.jpg">
    </body>`,
  );
  const domNodes = [dom.window.document.documentElement];
  const cdt = domNodesToCdt(domNodes);
  return await createRGridDom(domNodes, cdt);
}

async function run() {
  await eyes.open('some test', 'some app');
  const renderInfo = await eyes.getRenderInfo();
  const url = 'http://some/url';
  const rGridDom = await createDom();
  const imgLocation = await eyes.renderWindow(url, rGridDom, 1024, renderInfo);
  console.log('img location', imgLocation);
}

run();
