const {describe, it, before, after} = require('mocha');
const fetchResources = require('../../../../src/render-grid/sdk/fetchResources');
const {expect} = require('chai');
const {mapValues} = require('lodash');
const testServer = require('../../../util/testServer');
const {loadFixtureBuffer} = require('../../../util/loadFixture');

describe('fetchResources', () => {
  let baseUrl, closeServer;
  before(async () => {
    const server = await testServer();
    baseUrl = `http://localhost:${server.port}`;
    closeServer = server.close;
  });

  after(() => {
    closeServer();
  });

  it('works', async () => {
    const jpgName = 'smurfs.jpg';
    const jpgName1 = 'smurfs1.jpg';
    const jpgName2 = 'smurfs2.jpg';
    const jpgName3 = 'smurfs3.jpg';
    const cssName = 'test.css';
    const jsonName = 'test.cdt.json';
    const jsName = 'test.js';
    const importedName = 'imported.css';
    const importedNestedName = 'imported-nested.css';
    const fontZillaName = 'zilla_slab.woff2';
    const fontShadowName = 'shadows_into_light.woff2';
    const jpgUrl = `${baseUrl}/${jpgName}`;
    const jpgUrl1 = `${baseUrl}/${jpgName1}`;
    const jpgUrl2 = `${baseUrl}/${jpgName2}`;
    const jpgUrl3 = `${baseUrl}/${jpgName3}`;
    const cssUrl = `${baseUrl}/${cssName}`;
    const jsonUrl = `${baseUrl}/${jsonName}`;
    const jsUrl = `${baseUrl}/${jsName}`;
    const importedUrl = `${baseUrl}/${importedName}`;
    const importedNestedUrl = `${baseUrl}/${importedNestedName}`;
    const fontZillaUrl = `${baseUrl}/${fontZillaName}`;
    const fontShadowUrl = `${baseUrl}/${fontShadowName}`;
    const jpgContent = loadFixtureBuffer(jpgName);
    const jpgContent1 = loadFixtureBuffer(jpgName1);
    const jpgContent2 = loadFixtureBuffer(jpgName2);
    const jpgContent3 = loadFixtureBuffer(jpgName3);
    const cssContent = loadFixtureBuffer(cssName);
    const jsonContent = loadFixtureBuffer(jsonName);
    const jsContent = loadFixtureBuffer(jsName);
    const importedContent = loadFixtureBuffer(importedName);
    const importedNestedContent = loadFixtureBuffer(importedNestedName);
    const fontZillaContent = loadFixtureBuffer(fontZillaName);
    const fontShadowContent = loadFixtureBuffer(fontShadowName);

    const expected = mapValues(
      {
        [jpgUrl]: {type: 'image/jpeg', value: jpgContent},
        [jpgUrl1]: {type: 'image/jpeg', value: jpgContent1},
        [jpgUrl2]: {type: 'image/jpeg', value: jpgContent2},
        [jpgUrl3]: {type: 'image/jpeg', value: jpgContent3},
        [cssUrl]: {type: 'text/css; charset=UTF-8', value: cssContent},
        [jsonUrl]: {type: 'application/json; charset=UTF-8', value: jsonContent},
        [jsUrl]: {type: 'application/javascript; charset=UTF-8', value: jsContent},
        [importedUrl]: {type: 'text/css; charset=UTF-8', value: importedContent},
        [importedNestedUrl]: {
          type: 'text/css; charset=UTF-8',
          value: importedNestedContent,
        },
        [fontZillaUrl]: {type: 'application/font-woff2', value: fontZillaContent},
        [fontShadowUrl]: {type: 'application/font-woff2', value: fontShadowContent},
      },
      (o, url) => ({type: o.type, value: o.value, url}),
    );

    const resources = await fetchResources([jpgUrl, cssUrl, jsonUrl, jsUrl]);
    expect(Object.keys(resources).sort()).to.deep.equal(Object.keys(expected).sort());
    expect(resources).to.deep.equal(expected);
  });
});
