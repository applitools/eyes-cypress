/* globals describe,it,cy,Cypress */
describe('eyes.cypress', () => {
  it.skip('runs website', () => {
    cy.visit('http://applitools.com');
    cy.eyesOpen({
      appName: 'some app',
      testName: 'cypress-play',
      browser: [{width: 1024, height: 768}, {width: 800, height: 600}],
      showLogs: true,
    });
    cy.eyesCheckWindow('homepage');
    cy.get('.page .navbar a[href="/customers"]').click();
    cy.eyesCheckWindow('customers page');
    cy.get('a[href="/case-studies/walkme"]').click({force: true});
    cy.eyesCheckWindow('walkme page');
    cy.get('.navbar a[href="/pricing"]').click();
    cy.eyesCheckWindow('walkme page');
    cy.eyesClose();
  });

  it('runs', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'some app',
      testName: 'cypress-play-test',
      browser: {width: 1024, height: 768},
      showLogs: true,
    });
    cy.eyesCheckWindow('some tag');
    cy.eyesClose();
  });
});
