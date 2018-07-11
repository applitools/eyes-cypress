'use strict';
const {mapValues} = require('lodash');
const {RGridResource} = require('@applitools/eyes.sdk.core');
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

function makeGetAllResources({resourceCache, fetchResource, extractCssResources}) {
  async function getDependantResources({url, type, value}) {
    let dependentResources, fetchedResources;
    if (/text\/css/.test(type)) {
      dependentResources = extractCssResources(value.toString(), url);
      fetchedResources = await getOrFetchResources(dependentResources);
    }
    return {dependentResources, fetchedResources};
  }

  async function processResource(resource) {
    let {dependentResources, fetchedResources} = await getDependantResources(resource);
    const rGridResource = fromFetchedToRGridResource(resource);
    resourceCache.add(resource.url, toCacheEntry(rGridResource), dependentResources);
    return Object.assign({[resource.url]: rGridResource}, fetchedResources);
  }

  async function getOrFetchResources(resourceUrls, preResources = {}) {
    const resources = {};

    for (const url in preResources) {
      Object.assign(resources, await processResource(preResources[url]));
    }

    const missingResourceUrls = [];
    for (const url of resourceUrls) {
      const cacheEntry = resourceCache.getWithDependencies(url);
      if (cacheEntry) {
        Object.assign(resources, mapValues(cacheEntry, fromCacheToRGridResource));
      } else if (/^https?:$/i.test(new URL(url).protocol)) {
        missingResourceUrls.push(url);
      }
    }

    await Promise.all(
      missingResourceUrls.map(url =>
        fetchResource(url).then(async resource =>
          Object.assign(resources, await processResource(resource)),
        ),
      ),
    );

    return resources;
  }

  return async (absoluteUrls = [], preResources) =>
    await getOrFetchResources(absoluteUrls, preResources);
}

module.exports = makeGetAllResources;
