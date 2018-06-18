'use strict';

const {RGridDom} = require('@applitools/eyes.sdk.core');

function createRGridDom({cdt, resources}) {
  const resourceArr = Object.values(resources);
  const rGridDom = new RGridDom();
  rGridDom.setDomNodes(cdt);
  rGridDom.setResources(resourceArr);

  return rGridDom;
}

module.exports = createRGridDom;
