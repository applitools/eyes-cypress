/* globals describe,it,cy */
describe('random play', () => {
  it('random play', () => {
    cy.visit('https://rawgit.com/bvaughn/react-virtualized/master/playground/grid.html');
    cy.eyesOpen({
      appName: 'cypress play around',
    });
    cy.eyesCheckWindow();
    cy.eyesClose();
  });
});
