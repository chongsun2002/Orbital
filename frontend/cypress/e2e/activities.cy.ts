describe('Activities', () => {
    const activity = `activityTest${Date.now()}`;
    it('creates an activity', () => {
        cy.login();
        cy.get('li').contains('Join Activities').click();
        cy.url().should('contain', '/activities');
        cy.get('button').contains('Create Activity').click();
        cy.url().should('contain', '/activities/create');

        cy.get('input[name="title"]').type(activity);
        cy.get('textarea[name="description"]').type(activity);

        cy.get('button').contains('Pick a date').click();
        cy.get('button').contains(new Date().getDate()).click().click();

        cy.get('input[name="startTime"]').type('00:00');
        cy.get('input[name="endTime"]').type('23:59');

        cy.get('select').first().select('NUS', {force: true})
        cy.get('select').eq(1).select('Study', {force: true});
        
        cy.intercept('POST', '/activities/create').as('createActivity');
        cy.get('button[type="submit"]').click();
        cy.wait('@createActivity').then((interception) => {
            expect(interception.response?.body).to.not.be.null;
        });
        cy.url().should('contain', '/activities');

        cy.get('div[id="navProfileDisplay"]').click();
        cy.get('div').contains('My Activities').click();
        cy.get('div').should('contain', activity);
    })
})