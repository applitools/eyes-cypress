'use strict';
const fetchResource = require('./fetchResource');
const extractCssResources = require('./extractCssResources');
const {mapValues} = require('lodash');
const {RGridResource} = require('@applitools/eyes.sdk.core');
const createResourceCache = require('./createResourceCache');
const {URL} = require('url');

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
  rGridResource.setContentType(type || 'application/x-applitools-unknown'); // TODO test this
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

async function getDependantResources({url, type, value}, cache, logger) {
  let dependentResources, fetchedResources;
  if (/text\/css/.test(type)) {
    dependentResources = extractCssResources(value.toString(), url, logger);
    fetchedResources = await getOrFetchResources(dependentResources, cache, logger);
  }
  return {dependentResources, fetchedResources};
}

async function processResource(resource, cache, logger) {
  let {dependentResources, fetchedResources} = await getDependantResources(resource, cache, logger);
  const rGridResource = fromFetchedToRGridResource(resource);
  cache.add(resource.url, toCacheEntry(rGridResource), dependentResources);
  return Object.assign({[resource.url]: rGridResource}, fetchedResources);
}

async function getOrFetchResources(resourceUrls, cache, logger, preResources = {}) {
  const resources = {};

  for (const url in preResources) {
    Object.assign(resources, await processResource(preResources[url], cache, logger));
  }

  const missingResourceUrls = [];
  for (const url of resourceUrls) {
    const cacheEntry = cache.getWithDependencies(url);
    if (cacheEntry) {
      Object.assign(resources, mapValues(cacheEntry, fromCacheToRGridResource));
    } else if (/^https?:$/i.test(new URL(url).protocol)) {
      missingResourceUrls.push(url);
    }
  }

  await Promise.all(
    missingResourceUrls.map(url =>
      fetchResource(url, logger).then(async resource =>
        Object.assign(resources, await processResource(resource, cache, logger)),
      ),
    ),
  );

  return resources;
}

function makeGetAllResources(logger = console) {
  const cache = createResourceCache();
  return async (absoluteUrls = [], preResources) =>
    await getOrFetchResources(absoluteUrls, cache, logger, preResources);
}

module.exports = makeGetAllResources;
