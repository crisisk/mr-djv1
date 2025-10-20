/// <reference types="cypress" />

describe('Booking flow', () => {
  const baseUrl = Cypress.env('BASE_URL') || 'http://localhost:5173';

  beforeEach(() => {
    cy.intercept('POST', '/api/bookings', (req) => {
      expect(req.body).to.include({
        name: 'Test Gebruiker',
        email: 'tester@example.com',
        phone: '+31 6 12345678',
        eventType: 'bruiloft',
        packageId: 'silver',
        message: 'Kun je ook sax meenemen?',
      });

      expect(req.body.eventDate).to.match(/\d{4}-\d{2}-\d{2}/);

      req.reply({
        statusCode: 200,
        body: {
          bookingId: 'booking-123',
          status: 'received',
          message: 'Bedankt! We nemen binnen 24 uur contact op.',
        },
      });
    }).as('createBooking');
  });

  it('allows a visitor to request a booking from landing page to confirmation', () => {
    cy.viewport(1280, 720);
    cy.visit(baseUrl);

    cy.contains('Controleer Beschikbaarheid').scrollIntoView();

    cy.get('input#name').type('Test Gebruiker');
    cy.get('input#email').type('tester@example.com');
    cy.get('input#phone').type('+31 6 12345678');

    cy.get('select#eventType').select('Bruiloft');
    cy.get('select#packageId').select('Zilver pakket (meest gekozen)');

    cy.get('button.rdp-day')
      .not('.rdp-day_outside')
      .not('[disabled]')
      .first()
      .click();

    cy.get('textarea#message').type('Kun je ook sax meenemen?');

    cy.contains('button', 'Controleer & Vraag Aan').click();

    cy.wait('@createBooking').its('response.statusCode').should('eq', 200);

    cy.contains('Bedankt! We nemen binnen 24 uur contact op.').should('be.visible');
    cy.get('input#name').should('have.value', '');
    cy.get('select#eventType').should('have.value', '');
    cy.get('textarea#message').should('have.value', '');
  });
});
