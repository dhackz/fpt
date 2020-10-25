/// <reference types="cypress" />
//
context('Actions', () => {
  beforeEach(() => {
    cy.visit('http://localhost/')
    cy.waitForReact();
  })
  it('Buttons should be visible', () => {
    // https://on.cypress.io/type
    cy.react('*', { props: {name: "hostbutton"}, exact: true}).should('be.visible')
    cy.react('*', { props: {name: "joinbutton"}, exact: true}).should('be.visible')
  })
})
