describe('Reform.js Testing', function() {
  it('Open testpage', function() {
    cy.visit('./test/index.html');
    cy.readFile('./test/destination.json').then((str) => {
      cy.get('form').invoke('attr', 'action', str.url)
    });
  });
  it('Test 1: Initialisation', function() {
    cy.get('section:nth-child(1) form').should('have.class', 'rf-init');
    cy.get('section:nth-child(1) label:nth-child(1) input').type('Hallo');
    cy.get('section:nth-child(1) button').click();
    cy.get('section:nth-child(1) .resultSet').contains('"name":"Hallo"');
  });
  it('Test 2: Grouped Behavior', function() {
    cy.get('section:nth-child(2) form').should('have.class', 'rf-init');
    cy.get('section:nth-child(2) label:nth-child(1) p').click();
    cy.get('section:nth-child(2) label:nth-child(1) input').should('be.checked');
    cy.get('section:nth-child(2) label:nth-child(2) p').click();
    cy.get('section:nth-child(2) label:nth-child(1) input').should('not.be.checked');
    cy.get('section:nth-child(2) label:nth-child(2) input').should('be.checked');
    cy.get('section:nth-child(2) label:nth-child(3) p').click();
    cy.get('section:nth-child(2) label:nth-child(2) input').should('not.be.checked');
    cy.get('section:nth-child(2) label:nth-child(3) input').should('be.checked');
    cy.get('section:nth-child(2) button').click();
    cy.get('section:nth-child(2) .resultSet').contains('"checkbox":"sample-3"');
  });
  it('Test 3: Select Placeholder', function() {
    cy.get('section:nth-child(3) form').should('have.class', 'rf-init');
    cy.get('section:nth-child(3) button').click();
    cy.get('section:nth-child(3) .resultSet').contains('{"get":[],"post":[]}');
    cy.get('section:nth-child(3) select').select('option-1')
    cy.get('section:nth-child(3) button').click();
    cy.get('section:nth-child(3) .resultSet').contains('"select":"option-1"');
    cy.get('section:nth-child(3) select').select('rf-placeholder')
    cy.get('section:nth-child(3) button').click();
    cy.get('section:nth-child(3) .resultSet').contains('{"get":[],"post":[]}');
  });
  it('Test 4: Validation', function() {
    cy.get('section:nth-child(4) form').should('have.class', 'rf-init');
    cy.get('section:nth-child(4) button').click();
    cy.get('section:nth-child(4) label:nth-child(1)').should('not.have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(2)').should('have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(3)').should('have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(4)').should('have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(5)').should('have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(1) input').type('test 1');
    cy.get('section:nth-child(4) label:nth-child(2) input').type('test 1');
    cy.get('section:nth-child(4) label:nth-child(3) input').type('test 1');
    cy.get('section:nth-child(4) label:nth-child(4) input').type('test 1');
    cy.get('section:nth-child(4) label:nth-child(5) input').type('test 1');
    cy.get('section:nth-child(4) button').click();
    cy.get('section:nth-child(4) label:nth-child(3)').should('have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(4)').should('have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(5)').should('have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(3) .rf-error-info').contains('Email address not valid.');
    cy.get('section:nth-child(4) label:nth-child(4) .rf-error-info').contains('Web url not valid.');
    cy.get('section:nth-child(4) label:nth-child(5) .rf-error-info').contains('Phone number not valid.');
    cy.get('section:nth-child(4) label:nth-child(3) input').clear();
    cy.get('section:nth-child(4) label:nth-child(3) input').type('test.com');
    cy.get('section:nth-child(4) button').click();
    cy.get('section:nth-child(4) label:nth-child(3)').should('have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(3) input').clear();
    cy.get('section:nth-child(4) label:nth-child(3) input').type('sample@test.com');
    cy.get('section:nth-child(4) button').click();
    cy.get('section:nth-child(4) label:nth-child(3)').should('not.have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(4) input').clear();
    cy.get('section:nth-child(4) label:nth-child(4) input').type('sample@test.com');
    cy.get('section:nth-child(4) button').click();
    cy.get('section:nth-child(4) label:nth-child(4)').should('have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(4) input').clear();
    cy.get('section:nth-child(4) label:nth-child(4) input').type('test.com');
    cy.get('section:nth-child(4) button').click();
    cy.get('section:nth-child(4) label:nth-child(4)').should('not.have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(5) input').clear();
    cy.get('section:nth-child(4) label:nth-child(5) input').type('00000000');
    cy.get('section:nth-child(4) button').click();
    cy.get('section:nth-child(4) label:nth-child(5)').should('have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(5) input').clear();
    cy.get('section:nth-child(4) label:nth-child(5) input').type('1234');
    cy.get('section:nth-child(4) button').click();
    cy.get('section:nth-child(4) label:nth-child(5)').should('have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(5) input').clear();
    cy.get('section:nth-child(4) label:nth-child(5) input').type('+4912');
    cy.get('section:nth-child(4) button').click();
    cy.get('section:nth-child(4) label:nth-child(5)').should('have.class', 'rf-error');
    cy.get('section:nth-child(4) label:nth-child(5) input').clear();
    cy.get('section:nth-child(4) label:nth-child(5) input').type('+49 123 456');
    cy.get('section:nth-child(4) button').click();
    cy.get('section:nth-child(4) label:nth-child(5)').should('not.have.class', 'rf-error');
    cy.get('section:nth-child(4) .resultSet').contains('{"get":[],"post":{"name":"test 1","required":"test 1","email":"sample@test.com","ulr":"test.com","phone":"+49 123 456"}}');
  });
})