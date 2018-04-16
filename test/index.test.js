const makeEyes = require('../src/index');
const chai = require('chai');
const spies = require('chai-spies');
const EyesCypressImpl = require('../src/EyesCypressImpl');
const {expect} = chai;

chai.use(spies);

describe('makeEyes', () => {
  xit('returns a valid API', async () => {
    const eyes = await makeEyes('some test', 'some app', {});
    const spy = chai.spy(EyesCypressImpl.prototype.open);
    // expect(spy).to.have.been.called();
    expect(eyes.checkWindow).to.be.a('function');
    expect(eyes.close).to.be.a('function');
  });
});
