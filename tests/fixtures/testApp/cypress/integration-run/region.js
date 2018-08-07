describe('eyes.cypress', () => {

  // This also tests the setting of `testName` in `beforeEach`

  beforeEach(() => {
    cy.eyesOpen({
      appName: 'some app',
      browser: {width: 1024, height: 768},
      showLogs: true,
    });
  });

  it('hooks', () => {
    cy.setCookie('auth', 'secret');
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesCheckWindow({tag: 'selector', sizeMode: 'selector', selector: '.region'});
    cy.get('.absolutely').then($el => {
      const {left, top, width, height} = $el[0].getBoundingClientRect();
      cy.eyesCheckWindow({
        tag: 'region',
        sizeMode: 'region',
        region: {left, top, width, height},
      });
    });
    cy.eyesClose();
  });
});
