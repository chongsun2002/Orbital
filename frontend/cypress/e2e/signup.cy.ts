describe('Signup', () => {
    const newEmail = `TEST-SIGNUP${Date.now()}@gmail.com`;

    it('should fail on passwords which are too short', () => {
        cy.visit('/signup');
        cy.get('input[name="email"]').type(newEmail);
        cy.get('input[name="name"]').type('test user');
        cy.get('input[name="password"]').type('signup');
        cy.get('input[name="verifyPassword"]').type('signup');
        cy.get('button[type="submit"').click();
        cy.get('div').should('contain', 'Password must have at least 8 characters');
    });

    it('should fail when passwords do not match', () => {
        cy.visit('/signup');
        cy.get('input[name="email"]').type(newEmail);
        cy.get('input[name="name"]').type('test user');
        cy.get('input[name="password"]').type('signupTest');
        cy.get('input[name="verifyPassword"]').type('signupTest123');
        cy.get('button[type="submit"').click();
        cy.get('div').should('contain', 'Passwords do not match');
    });

    it('should signup with a unique email address', () => {
        cy.visit('/signup');
        cy.get('input[name="email"]').type(newEmail);
        cy.get('input[name="name"]').type('test user');
        cy.get('input[name="password"]').type('signupTest');
        cy.get('input[name="verifyPassword"]').type('signupTest');
        cy.get('button[type="submit"').click();
        cy.url().should('eq', Cypress.config('baseUrl') + '/');
        cy.getCookie('session').should('exist');
        cy.get('div').should('contain', 'test user');
    })

    it('should fail on duplicate email address', () => {
        cy.visit('/signup');
        cy.get('input[name="email"]').type(newEmail);
        cy.get('input[name="name"]').type('test user');
        cy.get('input[name="password"]').type('signupTest');
        cy.get('input[name="verifyPassword"]').type('signupTest');
        cy.get('button[type="submit"').click();
        cy.get('div').should('contain', 'This account already exists');
    })
})