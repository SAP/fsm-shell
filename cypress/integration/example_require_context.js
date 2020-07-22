/// <reference types="cypress" />

context('Docsify start and load', () => {
  const getIframeDocument = () => {
    return (
      cy
        .get('iframe')
        // Cypress yields jQuery element, which has the real
        // DOM element under property "0".
        // From the real DOM iframe element we can get
        // the "document" element, it is stored in "contentDocument" property
        // Cypress "its" command can access deep properties using dot notation
        // https://on.cypress.io/its
        .its('0.contentDocument')
        .should('exist')
    );
  };

  const getIframeBody = () => {
    // get the iframe > document > body
    // and retry until the body element is not empty
    return (
      cy
        .get('iframe')
        .its('0.contentDocument.body')
        .should('not.be.empty')
        // wraps "body" DOM element to allow
        // chaining more Cypress commands, like ".find(...)"
        // https://on.cypress.io/wrap
        .then(cy.wrap)
    );
  };

  beforeEach(() => {
    cy.visit('http://localhost:3000');
  });

  it('Require_context get data from hell-host', () => {
    // https://on.cypress.io/window
    cy.window().should('have.property', 'top');
    cy.get('li > a').click();
    getIframeBody()
      .find('h2')
      .should('be.visible')
      .should('have.text', 'Hi shell-docsify / my_account / sap!');
  });
});
