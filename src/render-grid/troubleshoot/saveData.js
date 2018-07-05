'use strict';
const log = require('../sdk/log');
const fs = require('fs');
const {promisify: p} = require('util');
const {resolve} = require('path');
const {renderDomNodesToHtml, createAbsolutizedDomNodes, getResourceName} = require('./cdt');
const getFolderName = require('./getFolderName');
const {mapValues} = require('lodash');
const _mkdirp = require('mkdirp');

const writeFile = p(fs.writeFile);
const mkdirp = p(_mkdirp);

async function saveData({renderId, cdt, resources, url}) {
  log(`saving data for renderId=${renderId}`);
  const folderName = getFolderName(renderId, new Date());
  const path = resolve(process.cwd(), '.applitools', folderName);
  try {
    await mkdirp(path);
  } catch (ex) {
    log(`${path} already exists`);
  }
  writeFile(resolve(path, 'cdt.json'), JSON.stringify(cdt));
  const absolutizedCdt = createAbsolutizedDomNodes(cdt, resources, url);
  const html = renderDomNodesToHtml(absolutizedCdt);
  writeFile(resolve(path, `${renderId}.html`), html);
  writeFile(
    resolve(path, 'resources.json'),
    JSON.stringify(
      mapValues(resources, resource => ({
        type: resource.getContentType(),
        hash: resource.getSha256Hash(),
      })),
      null,
      2,
    ),
  );
  Object.keys(resources).map(resourceUrl => {
    const resource = resources[resourceUrl];
    const content = resource.getContent();
    if (content) {
      const resourceName = getResourceName(resource);
      log(`saving resource: ${resourceUrl} as ${resourceName}`);
      return writeFile(resolve(path, resourceName), content);
    } else {
      log(`NOT saving resource (missing content): ${resourceUrl}`);
      return Promise.resolve();
    }
  });
}

module.exports = saveData;
