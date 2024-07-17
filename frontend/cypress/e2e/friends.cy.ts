describe('Friends', () => {
    it('adds friends successfully', () => {
        const email1 = `TEST-FRIEND-ONE${Date.now()}@gmail.com`;
        const email2 = `TEST-FRIEND-TWO${Date.now()}@gmail.com`;
        cy.loginWith(email1);
        cy.logout();
        cy.loginWith(email2);
        cy.get('li').contains('Find Friends').click();
        cy.url().should('contain', '/friends');
        cy.get('input[id="search"]').type(email1);
        cy.get('div').contains(email1).click();
        cy.get('button').contains('Send Friend Request').click();

        cy.logout();
        cy.loginWith(email1);
        cy.get('div[id="navProfileDisplay"]').click();
        cy.get('div').contains('My Friends').click();
        cy.get('div').contains(email2);
    })

    it('adds two friends automatically if anonymous friend requests are sent both ways', () => {
        const email1 = `TEST-FRIEND-ONE${Date.now()}@gmail.com`;
        const email2 = `TEST-FRIEND-TWO${Date.now()}@gmail.com`;
        cy.loginWith(email1);
        cy.logout();
        cy.loginWith(email2);
        cy.get('li').contains('Find Friends').click();
        cy.url().should('contain', '/friends');
        cy.get('input[id="search"]').type(email1);
        cy.get('div').contains(email1).click();
        cy.get('button').contains('Send Anonymous Friend Request').click();

        cy.logout();
        cy.loginWith(email1);
        cy.get('li').contains('Find Friends').click();
        cy.url().should('contain', '/friends');
        cy.get('input[id="search"]').type(email2);
        cy.get('div').contains(email2).click();
        cy.get('button').contains('Send Anonymous Friend Request').click();   

        cy.get('div[id="navProfileDisplay"]').click();
        cy.get('div').contains('My Friends').click();
        cy.get('div').contains(email2);
    })

    it('adds two friends automatically if public friend requests are sent both ways', () => {
        const email1 = `TEST-FRIEND-ONE${Date.now()}@gmail.com`;
        const email2 = `TEST-FRIEND-TWO${Date.now()}@gmail.com`;
        cy.loginWith(email1);
        cy.logout();
        cy.loginWith(email2);
        cy.get('li').contains('Find Friends').click();
        cy.url().should('contain', '/friends');
        cy.get('input[id="search"]').type(email1);
        cy.get('div').contains(email1).click();
        cy.get('button').contains('Send Friend Request').click();

        cy.logout();
        cy.loginWith(email1);
        cy.get('li').contains('Find Friends').click();
        cy.url().should('contain', '/friends');
        cy.get('input[id="search"]').type(email2);
        cy.get('div').contains(email2).click();
        cy.get('button').contains('Send Friend Request').click();   

        cy.get('div[id="navProfileDisplay"]').click();
        cy.get('div').contains('My Friends').click();
        cy.get('div').contains(email2);
    })

    it('adds two friends automatically if friend requests are sent both ways (one public and one anonymous)', () => {
        const email1 = `TEST-FRIEND-ONE${Date.now()}@gmail.com`;
        const email2 = `TEST-FRIEND-TWO${Date.now()}@gmail.com`;
        cy.loginWith(email1);
        cy.logout();
        cy.loginWith(email2);
        cy.get('li').contains('Find Friends').click();
        cy.url().should('contain', '/friends');
        cy.get('input[id="search"]').type(email1);
        cy.get('div').contains(email1).click();
        cy.get('button').contains('Send Anonymous Friend Request').click();

        cy.logout();
        cy.loginWith(email1);
        cy.get('li').contains('Find Friends').click();
        cy.url().should('contain', '/friends');
        cy.get('input[id="search"]').type(email2);
        cy.get('div').contains(email2).click();
        cy.get('button').contains('Send Friend Request').click();   

        cy.get('div[id="navProfileDisplay"]').click();
        cy.get('div').contains('My Friends').click();
        cy.get('div').contains(email2);
    })
})