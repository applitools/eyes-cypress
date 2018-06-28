'use strict';

const {RectangleSize, RenderRequest, RenderInfo} = require('@applitools/eyes.sdk.core');
const createRGridDom = require('./createRGridDom');

function createRenderRequests({url, resources, cdt, browsers, renderInfo, sizeMode}) {
  const rGridDom = createRGridDom({resources, cdt});

  return browsers.map(
    ({width, height, name}) =>
      new RenderRequest(
        renderInfo.getResultsUrl(),
        url,
        rGridDom,
        RenderInfo.fromRectangleSize(new RectangleSize({width, height}), sizeMode),
        'Linux',
        name,
      ),
  );
}

module.exports = createRenderRequests;
