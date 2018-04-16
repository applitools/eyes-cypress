const EyesCypressImpl = require('../src/EyesCypressImpl');

describe('EyesCypressImpl.open', () => {
  const config = {
    apiKey: process.env.APPLITOOLS_API_KEY,
  };

  const eyes = new EyesCypressImpl(config);

  it('calls openBase', async () => {
    await eyes.open('some test', 'some app');
  });
});
