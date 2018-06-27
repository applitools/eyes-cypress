'use strict';

const {RectangleSize, RenderRequest, RenderInfo} = require('@applitools/eyes.sdk.core');
const createRGridDom = require('./createRGridDom');

function createRenderRequests({url, resources, cdt, viewportSizes, renderInfo, sizeMode}) {
  const rGridDom = createRGridDom({resources, cdt});

  return viewportSizes.map(
    viewportSize =>
      new RenderRequest(
        renderInfo.getResultsUrl(),
        url,
        rGridDom,
        RenderInfo.fromRectangleSize(new RectangleSize(viewportSize), sizeMode),
        'Linux',
        'chrome',
      ),
  );
}

module.exports = createRenderRequests;
