describe('Hello world', () => {
  it.skip('shows how to use Applitools Eyes with Cypress', () => {
    // cy.visit('https://applitools.com/helloworld');
    // cy.eyesOpen({
    //   appName: 'Hello World!',
    //   testName: 'My first JavaScript test!',
    //   viewportSize: { width: 800, height: 600 },
    //   showLogs: true
    // });
    // cy.eyesCheckWindow('Main Page');
    // cy.get('button').click();
    // cy.eyesCheckWindow('Click!');
    // cy.eyesClose();

    const url = `https://applitools.com/helloworld`;
    cy.visit(url);
    cy.eyesOpen({
      appName: 'some app',
      testName: 'cypress-run',
      viewportSize: {width: 1024, height: 768},
      showLogs: true
    });
    cy.eyesCheckWindow('some tag');
    cy.eyesClose();

  });
});