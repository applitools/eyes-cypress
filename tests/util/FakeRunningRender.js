'use strict';

class FakeRunningRender {
  constructor(renderId, renderStatus) {
    this.renderId = renderId;
    this.renderStatus = renderStatus;
  }

  getRenderStatus() {
    return this.renderStatus;
  }

  getRenderId() {
    return this.renderId;
  }
}

module.exports = FakeRunningRender;
