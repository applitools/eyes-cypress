/* globals describe,it,cy,Cypress */
describe('eyes.cypress', () => {
  it('simple', () => {
    const url = `http://localhost:${Cypress.config('testPort')}/test.html`;
    cy.visit(url);
  });
});
