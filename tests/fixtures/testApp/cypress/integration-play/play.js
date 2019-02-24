/* globals describe,it,cy */
describe('Hello world', () => {
  it('works', () => {
    cy.eyesOpen({
      appName: 'someApp',
      testName: 'Check all landing page widgets',
      browser: [
        {width: 1440, height: 900, name: 'firefox'},
        {width: 1440, height: 900, name: 'chrome'},
      ],
    });
    cy.visit('https://www.unibet.com/betting#home');

    cy.eyesCheckWindow({
      tag: 'Nearby times before click',
    });

    cy.eyesClose();
  });
});
