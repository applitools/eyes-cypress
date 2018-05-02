const {URL} = require('url');
const fetchResources = require('./fetchResources');
const log = require('./log');

// NOTE: `let` and not `const` because of tests
let allResources = {};

async function getAllResources(resourceUrls, baseUrl) {
  const absoluteUrls = resourceUrls.map(resourceUrl => new URL(resourceUrl, baseUrl).href);
  const missingResourceUrls = absoluteUrls.filter(resourceUrl => !allResources[resourceUrl]);
  missingResourceUrls.length && log(`fetching missing resources: ${missingResourceUrls}`);
  const fetchedResources = await fetchResources(missingResourceUrls);
  Object.assign(allResources, fetchedResources); // add to cache

  const resources = {};
  for (const url of absoluteUrls) {
    resources[url] = allResources[url];
  }

  return resources;
}

// NOTE: ugly, because of tests. Other alternative is to export a "createGetAllResources" which would initialize the cache.
getAllResources.clearCache = () => {
  allResources = {};
};

module.exports = getAllResources;
