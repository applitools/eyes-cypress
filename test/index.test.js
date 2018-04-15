const makeEyes = require('../src/index');
const {expect} = require('chai');

describe('makeEyes', () => {
  it('returns a valid API', () => {
    const eyes = makeEyes('some test', 'some app', {});
    expect(eyes.checkWindow).to.be.a('function');
    expect(eyes.close).to.be.a('function');
  });
});
