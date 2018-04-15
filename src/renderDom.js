const extractResources = require('./extractResources');
const fetchResources = require('./fetchResources');
const computeHashes = require('./computeHashes');

async function renderDom(dom) {
  let renderId;
  const resourceUrls = extractResources(dom);
  const allResources = await fetchResources(resourceUrls);
  const hashes = computeHashes(allResources);

  // TODO send POST to /render
  // TODO send [PUT,...] to /resources
  // TODO enqueue renderId and optionally trigger

  return renderId;
}

module.exports = renderDom;
