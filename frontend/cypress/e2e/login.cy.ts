describe('Login', () => {
  it('logins successfully with valid credentials', () => {
    cy.login();
    cy.url().should('eq', Cypress.config('baseUrl') + '/');
    cy.getCookie('session').should('exist');
  })

  it('fails to login with incorrect credentials', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('login@gmail.com');
    cy.get('input[name="password"').type('abcd1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('eq', Cypress.config('baseUrl') + '/login');
    cy.get('div').should('contain', 'Incorrect email or password')
  }), 
  
  it('fails to login with invalid email', () => {
    cy.visit('/login');
    cy.get('input[name="email"]').type('login');
    cy.get('input[name="password"').type('abcd1234');
    cy.get('button[type="submit"]').click();
    cy.url().should('eq', Cypress.config('baseUrl') + '/login');
    cy.get('div').should('contain', 'Invalid email')
  })
})