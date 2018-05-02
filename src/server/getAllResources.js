const {URL} = require('url');
const fetchResources = require('./fetchResources');
const log = require('./log');
const {mapValues, omit} = require('lodash');

// NOTE: `let` and not `const` because of tests
let allResources = {};

async function getAllResources(resourceUrls, baseUrl) {
  const absoluteUrls = resourceUrls.map(resourceUrl => new URL(resourceUrl, baseUrl).href);
  const resources = {};
  for (const url of absoluteUrls) {
    resources[url] = allResources[url];
  }

  const missingResourceUrls = absoluteUrls.filter(resourceUrl => !allResources[resourceUrl]);
  if (missingResourceUrls.length) {
    log(`fetching missing resources: ${missingResourceUrls}`);
    const fetchedResources = await fetchResources(missingResourceUrls);
    Object.assign(allResources, mapValues(fetchedResources, o => omit(o, 'value'))); // add to cache without the buffer
    Object.assign(resources, fetchedResources);
  }

  return resources;
}

// NOTE: ugly, because of tests. Other alternative is to export a "createGetAllResources" which would initialize the cache.
getAllResources.clearCache = () => {
  allResources = {};
};

module.exports = getAllResources;
