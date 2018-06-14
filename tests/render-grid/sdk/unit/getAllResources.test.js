const {describe, it, afterEach} = require('mocha');
const {expect} = require('chai');
const {mapValues} = require('lodash');
const getAllResources = require('../../../../src/render-grid/sdk/getAllResources');
const {clearCache} = getAllResources;
const {RGridResource} = require('@applitools/eyes.sdk.core');
const testServer = require('../../../util/testServer');
const {loadFixtureBuffer} = require('../../../util/loadFixture');

function toRGridResource({url, type, value}) {
  const resource = new RGridResource();
  resource.setUrl(url);
  resource.setContentType(type);
  resource.setContent(value);
  resource.getSha256Hash();
  return resource;
}

describe('getAllResources', () => {
  let closeServer;

  afterEach(() => {
    clearCache();
  });

  it('works for absolute urls', async () => {
    const server = await testServer();
    const baseUrl = `http://localhost:${server.port}`;
    closeServer = server.close;

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
      (o, url) => toRGridResource({type: o.type, value: o.value, url}),
    );

    try {
      const resources = await getAllResources([jpgUrl, cssUrl, jsonUrl, jsUrl]);
      expect(resources).to.deep.equal(expected);
    } catch (ex) {
      throw ex;
    } finally {
      closeServer();
    }
  });

  it('fetches with cache', async () => {
    const server = await testServer();
    closeServer = server.close;

    const url = `http://localhost:${server.port}/test.js`;
    const expected = {
      [url]: toRGridResource({
        url,
        type: 'application/javascript; charset=UTF-8',
        value: loadFixtureBuffer('test.js'),
      }),
    };

    try {
      const resources = await getAllResources([url]);
      expect(resources).to.deep.equal(expected);
    } catch (ex) {
      throw ex;
    } finally {
      closeServer();
    }

    const expectedFromCache = mapValues(expected, rGridResource => {
      rGridResource._content = null; // yuck! but this is the symmetrical yuck of getAllResources::fromCacheToRGridResource since we save resource in cache without content, but with SHA256
      return rGridResource;
    });

    const resourcesFromCache = await getAllResources([url]);
    expect(resourcesFromCache).to.deep.equal(expectedFromCache);
  });

  it('works for urls with long paths', async () => {
    const server = await testServer();
    closeServer = server.close;

    const url = `long/path/to/something.js`;
    const absoluteUrl = `http://localhost:${server.port}/${url}`;
    const expected = {
      [absoluteUrl]: toRGridResource({
        url: absoluteUrl,
        type: 'application/javascript; charset=UTF-8',
        value: loadFixtureBuffer(url),
      }),
    };

    try {
      const resources = await getAllResources([absoluteUrl]);
      expect(resources).to.deep.equal(expected);
    } catch (ex) {
      throw ex;
    } finally {
      await closeServer();
    }
  });

  it('gets inner css resources also for cached resources', async () => {
    const server = await testServer();
    closeServer = server.close;

    const baseUrl = `http://localhost:${server.port}`;

    const jpgName1 = 'smurfs1.jpg';
    const jpgName2 = 'smurfs2.jpg';
    const jpgName3 = 'smurfs3.jpg';
    const cssName = 'test.css';
    const importedName = 'imported.css';
    const importedNestedName = 'imported-nested.css';
    const fontZillaName = 'zilla_slab.woff2';
    const fontShadowName = 'shadows_into_light.woff2';
    const jpgUrl1 = `${baseUrl}/${jpgName1}`;
    const jpgUrl2 = `${baseUrl}/${jpgName2}`;
    const jpgUrl3 = `${baseUrl}/${jpgName3}`;
    const cssUrl = `${baseUrl}/${cssName}`;
    const importedUrl = `${baseUrl}/${importedName}`;
    const importedNestedUrl = `${baseUrl}/${importedNestedName}`;
    const fontZillaUrl = `${baseUrl}/${fontZillaName}`;
    const fontShadowUrl = `${baseUrl}/${fontShadowName}`;
    const jpgContent1 = loadFixtureBuffer(jpgName1);
    const jpgContent2 = loadFixtureBuffer(jpgName2);
    const jpgContent3 = loadFixtureBuffer(jpgName3);
    const cssContent = loadFixtureBuffer(cssName);
    const importedContent = loadFixtureBuffer(importedName);
    const importedNestedContent = loadFixtureBuffer(importedNestedName);
    const fontZillaContent = loadFixtureBuffer(fontZillaName);
    const fontShadowContent = loadFixtureBuffer(fontShadowName);

    const expected = mapValues(
      {
        [cssUrl]: {type: 'text/css; charset=UTF-8', value: cssContent},
        [importedUrl]: {type: 'text/css; charset=UTF-8', value: importedContent},
        [fontZillaUrl]: {type: 'application/font-woff2', value: fontZillaContent},
        [importedNestedUrl]: {
          type: 'text/css; charset=UTF-8',
          value: importedNestedContent,
        },
        [fontShadowUrl]: {type: 'application/font-woff2', value: fontShadowContent},
        [jpgUrl3]: {type: 'image/jpeg', value: jpgContent3},
        [jpgUrl1]: {type: 'image/jpeg', value: jpgContent1},
        [jpgUrl2]: {type: 'image/jpeg', value: jpgContent2},
      },
      (o, url) => toRGridResource({type: o.type, value: o.value, url}),
    );

    try {
      const resources = await getAllResources([cssUrl]);
      // expect(Object.keys(resources)).to.deep.equal(Object.keys(expected));
      expect(resources).to.deep.equal(expected);
    } catch (ex) {
      throw ex;
    } finally {
      await closeServer();
    }

    const expectedFromCache = mapValues(expected, rGridResource => {
      rGridResource._content = null; // yuck! but this is the symmetrical yuck of getAllResources::fromCacheToRGridResource since we save resource in cache without content, but with SHA256
      return rGridResource;
    });

    const resourcesFromCache = await getAllResources([cssUrl]);
    expect(resourcesFromCache).to.deep.equal(expectedFromCache);
  });
});
