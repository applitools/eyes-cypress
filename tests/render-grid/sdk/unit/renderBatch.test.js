'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const renderBatch = require('../../../../src/render-grid/sdk/renderBatch');
const {RenderStatus} = require('@applitools/eyes.sdk.core');
const FakeRunningRender = require('../../../util/FakeRunningRender');
const FakeRenderRequest = require('../../../util/FakeRenderRequest');

const createFakeWrapper = () => {
  return {
    async renderBatch(renderRequests) {
      return renderRequests.map((renderRequest, i) => {
        const renderId = renderRequest.getRenderId();
        return new FakeRunningRender(
          renderId || `id${i + 1}`,
          renderId ? `status${i + 1}` : RenderStatus.NEED_MORE_RESOURCES,
        );
      });
    },
    async putResources(dom, runningRender) {
      this.resourcesPutted.push({dom, renderId: runningRender.getRenderId()});
    },
    resourcesPutted: [],
  };
};

describe('renderBatch', () => {
  it('works', async () => {
    const renderRequests = [
      new FakeRenderRequest('dom1'),
      new FakeRenderRequest('dom2'),
      new FakeRenderRequest('dom3'),
    ];

    const wrapper = createFakeWrapper();

    const renderIds = await renderBatch(renderRequests, wrapper);
    expect(renderIds).to.eql(['id1', 'id2', 'id3']);

    expect(renderRequests.map(renderRequest => renderRequest.getRenderId())).to.eql([
      'id1',
      'id2',
      'id3',
    ]);

    expect(wrapper.resourcesPutted).to.eql([
      {dom: 'dom1', renderId: 'id1'},
      {dom: 'dom2', renderId: 'id2'},
      {dom: 'dom3', renderId: 'id3'},
    ]);
  });
});
