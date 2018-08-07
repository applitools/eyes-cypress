describe('eyes.cypress', () => {

  // This also tests the setting of `testName` in `before`

  it('pack', () => {
    cy.setCookie('auth', 'secret');
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'some app',
      browser: {width: 1024, height: 768},
      showLogs: true
    });
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
