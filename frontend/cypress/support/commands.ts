/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }

Cypress.Commands.add('loginByGoogleApi', () => {
    cy.log('Logging in to Google')
    cy.request({
      method: 'POST',
      url: 'https://www.googleapis.com/oauth2/v4/token',
      body: {
        grant_type: 'refresh_token',
        client_id: Cypress.env('googleClientId'),
        client_secret: Cypress.env('googleClientSecret'),
        refresh_token: Cypress.env('googleRefreshToken'),
      },
    }).then(({ body }) => {
      const { access_token, id_token } = body
  
      cy.request({
        method: 'GET',
        url: 'https://www.googleapis.com/oauth2/v3/userinfo',
        headers: { Authorization: `Bearer ${access_token}` },
      }).then(({ body }) => {
        cy.log(body)
        const { sub, name, email, picture } = body;
        cy.log(email);
  
        cy.request('POST', Cypress.env('API_URL') + 'api/v1/auth/google',    
            {
                googleId: sub,
                name: name,
                email: email,
                image: picture
            })
        }).as('google'); 

        cy.get('@google').should((response) => {
            assert.isNotNull(response.body.user);
            assert.isNotNull(response.body.token);
        })
      })
    })

Cypress.Commands.add('login', () => {
    cy.request({
      method: 'POST', 
      url: Cypress.env('API_URL') + 'api/v1/auth/signup', 
      body: {
        email: "login@gmail.com",
        name: "login test",
        password: "loginTest",
        verifyPassword: "loginTest"
      },
      failOnStatusCode: false
    });

    cy.intercept('POST', '/login').as('apiLogin');

    cy.visit('/login');
    cy.get('input[name="email"]').type('login@gmail.com');
    cy.get('input[name="password"').type('loginTest');

    cy.get('button[type="submit"]').click();
    cy.wait('@apiLogin');
})