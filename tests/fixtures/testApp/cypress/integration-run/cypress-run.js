describe('eyes.cypress', () => {
  it('runs', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'some app',
      testName: 'cypress-run',
      browser: {width: 1024, height: 768},
      showLogs: true,
    });
    cy.eyesCheckWindow('full page');
    cy.eyesCheckWindow({tag: 'selector', sizeMode: 'selector', selector: '.region'});
    cy.get('.absolutely').then($el => {
      const {left, top, width, height} = $el[0].getBoundingClientRect();
      console.log({left, top, width, height});
      cy.eyesCheckWindow({
        tag: 'region',
        sizeMode: 'region',
        region: {left, top, width, height},
      });
    });
    cy.eyesClose();
    

    
    // cy.eyesCheck(Target.region('.something'))
    // cy.get('.something').eyesCheckRegion()

    // cy.eyes().Open('some app', 'cypress-run', {width: 1024, height: 768});


    // cy.eyes().CheckWindow('some tag');
    // cy.eyesCheck(Target.region(selector).fully().ignore(selector2))

    // eye.check(Target.region(selector).fully().ignore(selector2))


    // cy.get('.dsdf').then(el => {
    //   return cy.eyesCheck({ region: el });
    // });

    // cy.eyesCheck({
    //   region: '.sdfsd',
    //   fully: true,
    //   ignore: ['.sdfsdf', '.'
    // })
    // cy.eyes().Close();
  });
});
