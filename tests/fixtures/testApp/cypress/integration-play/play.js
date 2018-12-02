/* globals describe,it,cy */
describe('random play', () => {
  it('random play', () => {
    cy.visit('http://applitools.github.io/demo/TestPages/FramesTestPage/');

    // const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    // cy.visit(url);

    cy.eyesOpen({
      appName: 'cypress play around',
    });
    cy.eyesCheckWindow({
      floating: [
        {
          top: 79.875,
          left: 8,
          width: 304,
          height: 184,
          maxUpOffset: 20,
          maxDownOffset: 20,
          maxLeftOffset: 2,
          maxRightOffset: 20,
        }, //coordinates and offsets
        {
          selector: '#overflowing-div-image',
          maxUpOffset: 20,
          maxDownOffset: 20,
          maxLeftOffset: 2,
          maxRightOffset: 20,
        },
      ], //CSS selector and offsets]
    });
    cy.eyesClose();
  });
});
