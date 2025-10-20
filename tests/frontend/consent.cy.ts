const STORAGE_KEY = 'mr-dj-consent-preferences';

describe('Cookie consent preferences', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.removeItem(STORAGE_KEY);
      },
    });
    cy.window().then((win) => {
      win.gtag = cy.stub().as('gtag');
      win.dataLayer = [];
    });
  });

  it('allows visitors to accept all cookies', () => {
    cy.contains('Cookie preferences').should('be.visible');
    cy.contains('Accept all').click();

    cy.contains('Cookie preferences').should('not.exist');
    cy.get('@gtag').should('have.been.calledWithMatch', 'consent', 'update', {
      ad_storage: 'granted',
      analytics_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
    });

    cy.window().then((win) => {
      const storedValue = win.localStorage.getItem(STORAGE_KEY);
      expect(storedValue, 'preferences are stored').to.be.a('string');
      const parsed = storedValue ? JSON.parse(storedValue) : {};
      expect(parsed.statistics).to.equal(true);
      expect(parsed.marketing).to.equal(true);
    });

    cy.contains('Cookie settings').should('be.visible').click();
    cy.get('input[aria-label="Toggle analytics cookies"]').should('be.checked');
    cy.get('input[aria-label="Toggle marketing cookies"]').should('be.checked');
  });

  it('allows visitors to decline non-essential cookies', () => {
    cy.contains('Decline non-essential').click();

    cy.contains('Cookie preferences').should('not.exist');
    cy.get('@gtag').should('have.been.calledWithMatch', 'consent', 'update', {
      ad_storage: 'denied',
      analytics_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
    });

    cy.window().then((win) => {
      const storedValue = win.localStorage.getItem(STORAGE_KEY);
      expect(storedValue, 'preferences are stored').to.be.a('string');
      const parsed = storedValue ? JSON.parse(storedValue) : {};
      expect(parsed.statistics).to.equal(false);
      expect(parsed.marketing).to.equal(false);
    });

    cy.contains('Cookie settings').should('be.visible').click();
    cy.get('input[aria-label="Toggle analytics cookies"]').should('not.be.checked');
    cy.get('input[aria-label="Toggle marketing cookies"]').should('not.be.checked');
  });
});
