const {URL} = require('url');
const fetchResources = require('./fetchResources');
const log = require('./log');
const {mapValues} = require('lodash');
const {RGridResource} = require('@applitools/eyes.sdk.core');

// NOTE: `let` and not `const` because of tests
let allResources = {};

function fromCacheToRGridResource({url, type, hash}) {
  const resource = new RGridResource();
  resource.setUrl(url);
  resource.setContentType(type);
  resource._sha256hash = hash; // yuck! but RGridResource assumes it always has the content, which we prefer not to save in cache.
  return resource;
}

function fromFetchedToRGridResource({url, type, value}) {
  const rGridResource = new RGridResource();
  rGridResource.setUrl(url);
  rGridResource.setContentType(type);
  rGridResource.setContent(value);
  return rGridResource;
}

function toCacheEntry(rGridResource) {
  return {
    url: rGridResource.getUrl(),
    type: rGridResource.getContentType(),
    hash: rGridResource.getSha256Hash(),
  };
}

async function getAllResources(resourceUrls, baseUrl) {
  const absoluteUrls = resourceUrls.map(resourceUrl => new URL(resourceUrl, baseUrl).href);
  const resources = {};
  for (const url of absoluteUrls) {
    const cacheEntry = allResources[url];
    if (cacheEntry) {
      resources[url] = fromCacheToRGridResource(cacheEntry);
    }
  }

  const missingResourceUrls = absoluteUrls.filter(resourceUrl => !allResources[resourceUrl]);
  if (missingResourceUrls.length) {
    log(`fetching missing resources: ${missingResourceUrls}`);
    const fetchedResources = await fetchResources(missingResourceUrls);
    const fetchedResourcesToReturn = mapValues(fetchedResources, fromFetchedToRGridResource);
    const fetchedResourcesForCache = mapValues(fetchedResourcesToReturn, toCacheEntry);
    Object.assign(allResources, fetchedResourcesForCache); // add to cache without the buffer
    Object.assign(resources, fetchedResourcesToReturn);
  }

  return resources;
}

// NOTE: ugly, because of tests. Other alternative is to export a "createGetAllResources" which would initialize the cache.
getAllResources.clearCache = () => {
  allResources = {};
};

module.exports = getAllResources;
