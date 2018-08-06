describe('eyes.cypress', () => {
  it('runs', () => {
    cy.setCookie('auth', 'secret');
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'some app',
      testName: 'cypress-run',
      browser: {width: 1024, height: 768},
      showLogs: true
    });
    cy.eyesCheckWindow('some tag');
    cy.eyesClose();
  });
});
