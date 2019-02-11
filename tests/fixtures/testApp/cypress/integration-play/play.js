/* globals describe,it,cy */
describe('Hello world', () => {
  it('works', () => {
    cy.eyesOpen({
      appName: 'Oral',
      testName: 'gils test',
    });
    cy.visit('https://beta.oral.fi/palvelut/hammaskiven-poisto/');

    cy.eyesCheckWindow({
      tag: 'Nearby times before click',
    });

    // cy.get('[aria-controls="panel-time-reservation"]');

    cy.eyesClose();
  });
});
