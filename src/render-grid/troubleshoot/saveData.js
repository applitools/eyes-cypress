'use strict';
const log = require('../sdk/log');
const fs = require('fs');
const {promisify: p} = require('util');
const {resolve} = require('path');
const {renderDomNodesToHtml, createAbsolutizedDomNodes, getResourceName} = require('./cdt');

const writeFile = p(fs.writeFile);
const mkdir = p(fs.mkdir);

async function saveData({renderId, cdt, resources, url}) {
  log(`saving data for renderId=${renderId}`);
  const path = resolve(__dirname, '../../../.applitools', renderId); // TODO production path
  try {
    await mkdir(path);
  } catch (ex) {
    log(`${path} already exists`);
  }
  writeFile(resolve(path, 'cdt.json'), JSON.stringify(cdt));
  const absolutizedCdt = createAbsolutizedDomNodes(cdt, resources, url);
  const html = renderDomNodesToHtml(absolutizedCdt);
  writeFile(resolve(path, `${renderId}.html`), html);
  Object.keys(resources).map(resourceUrl => {
    const resource = resources[resourceUrl];
    const content = resource.getContent();
    if (content) {
      log(`saving resource: ${resourceUrl}`);
      return writeFile(resolve(path, getResourceName(resource)), content);
    } else {
      log(`NOT saving resource (missing content): ${resourceUrl}`);
      return Promise.resolve();
    }
  });
}

module.exports = saveData;
