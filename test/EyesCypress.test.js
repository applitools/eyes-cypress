const EyesCypress = require('../src/EyesCypress');
const {expect} = require('chai');

describe('EyesCypress', () => {
  const cy = {
    document: () => {
      // TODO jsdom document
      return Promise.resolve();
    },
  };

  it('returns a valid API', () => {
    const eyes = EyesCypress(cy);
    expect(eyes.checkWindow).to.be.a('function');
    expect(eyes.close).to.be.a('function');
  });

  describe('checkWindow', () => {
    
  });
});
