const {describe, it, afterEach} = require('mocha');
const {expect} = require('chai');
const fs = require('fs');
const path = require('path');
const {mapValues} = require('lodash');
const getAllResources = require('../src/server/getAllResources');
const clearCache = getAllResources.clearCache;
const testServer = require('./testServer');

describe('getAllResources', () => {
  let baseUrl, closeServer;

  afterEach(() => {
    clearCache();
  });

  it('works for absolute urls', async () => {
    const server = await testServer();
    baseUrl = `http://localhost:${server.port}`;
    closeServer = server.close;

    const jpgName = 'smurfs.jpg';
    const cssName = 'test.css';
    const jsonName = 'test.cdt.json';
    const jsName = 'test.js';
    const jpgUrl = `${baseUrl}/${jpgName}`;
    const cssUrl = `${baseUrl}/${cssName}`;
    const jsonUrl = `${baseUrl}/${jsonName}`;
    const jsUrl = `${baseUrl}/${jsName}`;
    const jpgContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', jpgName));
    const cssContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', cssName));
    const jsonContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', jsonName));
    const jsContent = fs.readFileSync(path.resolve(__dirname, 'fixtures', jsName));

    const expected = mapValues(
      {
        [jpgUrl]: {type: 'image/jpeg', value: jpgContent},
        [cssUrl]: {type: 'text/css; charset=UTF-8', value: cssContent},
        [jsonUrl]: {type: 'application/json; charset=UTF-8', value: jsonContent},
        [jsUrl]: {type: 'application/javascript; charset=UTF-8', value: jsContent},
      },
      (o, url) => ({type: o.type, value: o.value, url}),
    );

    const resources = await getAllResources([jpgUrl, cssUrl, jsonUrl, jsUrl]);

    expect(resources).to.deep.equal(expected);
    closeServer();
  });

  it('works for relative urls', async () => {
    const server = await testServer();
    baseUrl = `http://localhost:${server.port}`;
    closeServer = server.close;

    const url = 'smurfs.jpg';
    const absoluteUrl = `${baseUrl}/${url}`;
    const expected = {
      [absoluteUrl]: {
        url: absoluteUrl,
        type: 'image/jpeg',
        value: fs.readFileSync(path.resolve(__dirname, 'fixtures/smurfs.jpg')),
      },
    };

    const resources = await getAllResources([url], baseUrl);
    expect(resources).to.deep.equal(expected);
    closeServer();
  });

  it.only('fetches with cache', async () => {
    const server = await testServer();
    baseUrl = `http://localhost:${server.port}`;
    closeServer = server.close;

    const url = `${baseUrl}/smurfs.jpg`;
    const expected = {
      [url]: {
        url,
        type: 'image/jpeg',
        value: fs.readFileSync(path.resolve(__dirname, 'fixtures/smurfs.jpg')),
      },
    };

    try {
      const resources = await getAllResources([url]);
      expect(resources).to.deep.equal(expected);
    } catch (ex) {
      throw ex;
    } finally {
      closeServer();
    }

    const expectedFromCache = {
      [url]: {
        url,
        type: 'image/jpeg',
      },
    };
    const resourcesFromCache = await getAllResources([url]);
    expect(resourcesFromCache).to.deep.equal(expectedFromCache);
  });
});
