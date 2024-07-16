describe('Profile', () => {
    it('can edit profile details', () => {
        cy.login();
        cy.intercept('POST', '/user/*').as('req');
        cy.get('div[id="navProfileDisplay"]').click();
        cy.get('div').contains('My Profile').click();
        cy.url().should('contain', 'user');
        const name = `profileTest${Date.now()}`;
        const timestamp = Math.floor(Math.random() * Date.now()); 
        const bday = new Date(timestamp).toISOString().substring(0,10);
        cy.get('input[name="name"]').clear().type(name);
        cy.get('textarea[name="bio"]').clear().type(name);
        cy.get('input[name="birthday"]').type(bday);
        cy.get('button[type="submit"]').click();
        cy.wait('@req');
        cy.reload();
        cy.get('div[id="navProfileDisplay"]').should('contain', name);
        cy.get('input[name="name"]').should('have.value', name);
        cy.get('textarea[name="bio"]').should('contain', name);
        cy.get('input[name="birthday"]').should('have.value', bday);
    });
})