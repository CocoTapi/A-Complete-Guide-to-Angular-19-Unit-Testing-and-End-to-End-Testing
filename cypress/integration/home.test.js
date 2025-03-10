describe('Home Page', () => {
    beforeEach(() => {
        // use mock data from fixture/courses.json
        cy.fixture('courses.json').as("coursesJSON");

        // mock backend
        cy.server();

        cy.route('/api/courses', "@coursesJSON").as("courses");

        cy.visit('/');
    })

    it ('should display a list of courses', () => {

        // check if the test is working
        // expect(true).to.equal(true); 
        
        //This is the text that shows without running server. 
        cy.contains("All Courses");

        // This is line 9's courses
        cy.wait('@courses');

        cy.get("mat-card").should("have.length", 9);
    });

    it ('should display the advanced courses', () => {

        cy.get('.mat-mdc-tab').should("have.length", 2);

        cy.get('.mat-mdc-tab').last().click();

        // title of each card is not empty
        cy.get('.mat-mdc-tab-body-active .mat-mdc-card-title').its('length').should('be.gt', 1)

        cy.get('.mat-mdc-tab-body-active .mat-mdc-card-title').first()
            .should ('contain', 'Angular Security Course')
    })
})