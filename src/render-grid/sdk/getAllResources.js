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

async function getDependantResources({url, type, value}, cache) {
  let dependentResources, fetchedResources;
  if (/text\/css/.test(type)) {
    dependentResources = extractCssResources(value.toString(), url);
    fetchedResources = await getOrFetchResources(dependentResources, cache);
  }
  return {dependentResources, fetchedResources};
}

async function processResource(resource, cache) {
  let {dependentResources, fetchedResources} = await getDependantResources(resource, cache);
  const rGridResource = fromFetchedToRGridResource(resource);
  cache.add(toCacheEntry(rGridResource), dependentResources);
  return Object.assign({[resource.url]: rGridResource}, fetchedResources);
}

async function getOrFetchResources(resourceUrls, cache, preResources = {}) {
  const resources = {};

  for (const url in preResources) {
    Object.assign(resources, await processResource(preResources[url], cache));
  }

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
      fetchResource(url).then(async resource =>
        Object.assign(resources, await processResource(resource, cache)),
      ),
    ),
  );

  return resources;
}

async function getAllResources(absoluteUrls = [], preResources) {
  return await getOrFetchResources(absoluteUrls, allResources, preResources);
}

// NOTE: ugly, because of tests. Other alternative is to export a "createGetAllResources" which would initialize the cache.
getAllResources.clearCache = () => {
  allResources._cache = {};
};

module.exports = getAllResources;
