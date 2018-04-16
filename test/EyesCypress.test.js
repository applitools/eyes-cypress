const EyesCypress = require('../src/EyesCypress');
const chai = require('chai');
const spies = require('chai-spies');
const EyesCypressImpl = require('../src/EyesCypressImpl');
const {expect} = chai;

chai.use(spies);

describe('EyesCypress', () => {
  const cy = {
    document: () => {
      // TODO jsdom document
      return Promise.resolve();
    },
  };

  xit('returns a valid API', async () => {
    const eyes = await EyesCypress(cy);
    const spy = chai.spy(EyesCypressImpl.prototype.open);
      // expect(spy).to.have.been.called();
    expect(eyes.checkWindow).to.be.a('function');
    expect(eyes.close).to.be.a('function');
  });

  describe('checkWindow', () => {
    
  });
});
