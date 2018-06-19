'use strict';
const {describe, it} = require('mocha');
const {expect} = require('chai');
const renderBatch = require('../../../../src/render-grid/sdk/renderBatch');
const {RenderStatus} = require('@applitools/eyes.sdk.core');

const creatFakeRunningRender = (renderId, renderStatus) => {
  return {
    getRenderStatus() {
      return renderStatus;
    },
    getRenderId() {
      return renderId;
    },
  };
};

const createFakeRenderRequest = dom => {
  return {
    getRenderId() {
      return this.renderId;
    },
    setRenderId(renderId) {
      this.renderId = renderId;
    },
    getDom() {
      return dom;
    },
  };
};

const createFakeWrapper = () => {
  return {
    async renderBatch(renderRequests) {
      return renderRequests.map((renderRequest, i) => {
        const renderId = renderRequest.getRenderId();
        return creatFakeRunningRender(
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
      createFakeRenderRequest('dom1'),
      createFakeRenderRequest('dom2'),
      createFakeRenderRequest('dom3'),
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
