describe('eyes-cypress', () => {

  // This also tests the setting of `testName` inside `it`

  it('multi browser version', () => {
    cy.setCookie('auth', 'secret');
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'some app',
      browser: [
        {width: 1024, height: 768, name: 'chrome-one-version-back'},
        {width: 1024, height: 768, name: 'chrome-two-versions-back'},
        {width: 1024, height: 768, name: 'firefox-one-version-back'},
        {width: 1024, height: 768, name: 'firefox-two-versions-back'},
        // {width: 1024, height: 768, name: 'safari-1'},
        // {width: 1024, height: 768, name: 'safari-2'},
      ]
      // showLogs: true,
    });
    cy.eyesCheckWindow('multi browser');
    cy.eyesClose();
  });
});
