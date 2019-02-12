/* globals describe,it,cy */
describe('Hello world', () => {
  it('works', () => {
    cy.eyesOpen({
      appName: 'Oral',
      testName: 'gils test',
    }).then(() => {
      console.error('OPEN DONE');
    });
    cy.visit('https://beta.oral.fi/palvelut/hammaskiven-poisto/').then(() => {
      console.error('VISIT DONE');
    });

    cy.wait(5000);
    cy.eyesCheckWindow({
      tag: 'Nearby times before click',
    }).then(() => {
      console.error('CHECK WINDOW  DONE');
    });

    cy.get('[aria-controls="panel-time-reservation"]').then(() => {
      console.error('GET  DONE');
    });

    cy.eyesClose();
  });
});
