'use strict';

class FakeRenderRequest {
  constructor(dom) {
    this.dom = dom;
  }

  getRenderId() {
    return this.renderId;
  }

  setRenderId(renderId) {
    this.renderId = renderId;
  }

  getDom() {
    return this.dom;
  }
}

module.exports = FakeRenderRequest;
