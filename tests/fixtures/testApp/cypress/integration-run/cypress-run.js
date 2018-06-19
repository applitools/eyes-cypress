describe('eyes.cypress', () => {
  it('runs', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesOpen({ appName: 'some app', testName: 'cypress-run', viewportSize: {width: 1024, height: 768}, isVerbose: true});
    cy.eyesCheckWindow('some tag');
    cy.eyesClose();

    
    // cy.eyesCheck(Target.region('.something'))
    // cy.get('.something').eyesCheckRegion()
    // cy.eyes().Open('some app', 'cypress-run', {width: 1024, height: 768});
    // cy.eyes().CheckWindow('some tag');
    // cy.eyesCheck(Target.region(selector).fully().ignore(selector2))
    // cy.eyes().Close();
  });
});
