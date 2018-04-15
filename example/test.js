describe('some test suite', () => {
  let eyes;

  before(async function() {
    const makeEyes = require('@applitools/eyes.cypress');
    const options = {
      formFactors: [{width, height, browser}],
      batchId,
      apiKey,
      batchName,
      branchName,
    };
    eyes = await makeEyes(testName, appName, options);
  });

  after(async function() {
    await eyes.close();
  });

  it('some test', async () => {
    await eyes.checkWindow();
  });
});
