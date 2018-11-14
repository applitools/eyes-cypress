/* globals describe,it,cy */
describe('random play', () => {
  it('random play', () => {
    cy.visit('https://theintercept.com/privacy-policy/');
    cy.eyesOpen({
      appName: 'cypress play around',
    });
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
