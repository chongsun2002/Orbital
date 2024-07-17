describe('Google', () => {
    it('should sign in with a Google account', () => {
        cy.visit('/login');
        cy.loginByGoogleApi();
    })
})