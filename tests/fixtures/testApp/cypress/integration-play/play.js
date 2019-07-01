/* global beforeEach, afterEach, describe, it, cy */

beforeEach(() => {
  cy.eyesOpen({
    appName: 'product-page-applitools',
    browser: {width: 1024, height: 768, name: 'chrome'},
  });
});

afterEach(() => {
  cy.eyesClose();
});

describe('product-page-applitools', () => {
  it('Abra', () => {
    cy.visit(
      'https://www.roomandboard.com/catalog/lighting/pendant-lights-and-chandeliers/abra-pendant-sets-row-of-3-or-5',
    );
    cy.wait(2000);
    cy.eyesCheckWindow('Abra pendant');
  });
});
