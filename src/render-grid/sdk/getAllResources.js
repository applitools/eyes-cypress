'use strict';
const fetchResource = require('./fetchResource');
const extractCssResources = require('./extractCssResources');
const {mapValues} = require('lodash');
const {RGridResource} = require('@applitools/eyes.sdk.core');

// NOTE: `let` and not `const` because of tests
let allResources = {_cache: {}};
allResources.add = (entry, dependencies) => {
  allResources._cache[entry.url] = Object.assign({dependencies}, entry);
};

allResources.getWithDependencies = key => {
  function doGet(_key) {
    const entry = allResources._cache[_key];
    if (!entry) return;

    const ret = {};
    ret[_key] = entry; // TODO omit dependencies
    if (entry.dependencies) {
      entry.dependencies.forEach(dep => {
        Object.assign(ret, doGet(dep));
      });
    }
    return ret;
  }

  return doGet(key);
};

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

async function getOrFetchResources(resourceUrls, cache) {
  const resources = {};
  const missingResourceUrls = [];
  for (const url of resourceUrls) {
    const cacheEntry = cache.getWithDependencies(url);
    if (cacheEntry) {
      Object.assign(resources, mapValues(cacheEntry, fromCacheToRGridResource));
    } else if (/^https?:\/\//.test(url)) {
      missingResourceUrls.push(url);
    }
  }

  await Promise.all(
    missingResourceUrls.map(url =>
      fetchResource(url).then(async resource => {
        let dependentResources;
        if (/text\/css/.test(resource.type)) {
          dependentResources = extractCssResources(resource.value.toString(), url);
          const fetchedResources = await getOrFetchResources(dependentResources, cache);
          Object.assign(resources, fetchedResources);
        }
        const rGridResource = fromFetchedToRGridResource(resource);
        resources[url] = rGridResource;
        cache.add(toCacheEntry(rGridResource), dependentResources);
      }),
    ),
  );

  return resources;
}

async function getAllResources(absoluteUrls = []) {
  return await getOrFetchResources(absoluteUrls, allResources);
}

// NOTE: ugly, because of tests. Other alternative is to export a "createGetAllResources" which would initialize the cache.
getAllResources.clearCache = () => {
  allResources._cache = {};
};

module.exports = getAllResources;
