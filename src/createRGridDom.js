const extractResources = require('./extractResources');
const fetchResources = require('./fetchResources');
const {RGridDom, RGridResource} = require('@applitools/eyes.sdk.core');

async function createRGridDom(domNodes, cdt) {
  const resourceUrls = extractResources(domNodes);
  const resourceContents = await fetchResources(resourceUrls);

  const resources = resourceUrls.map((resourceUrl, index) => {
    const resource = new RGridResource();
    resource.setUrl(resourceUrl);
    resource.setContentType(resourceContents[index].type);
    resource.setContent(resourceContents[index].value);
    return resource;
  });

  const rGridDom = new RGridDom();
  rGridDom.setDomNodes(cdt);
  rGridDom.setResources(resources);

  return rGridDom;
}

module.exports = createRGridDom;
