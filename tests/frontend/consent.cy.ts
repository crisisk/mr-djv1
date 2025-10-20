const STORAGE_KEY = 'mr-dj-consent-preferences';

describe('Cookie consent preferences', () => {
  beforeEach(() => {
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.removeItem(STORAGE_KEY);
        (win as typeof win & { __MR_DJ_FACEBOOK_PIXEL_ID?: string }).__MR_DJ_FACEBOOK_PIXEL_ID =
          '123456789012345';
      },
    });
    cy.window().then((win) => {
      const anyWindow = win as typeof win & {
        gtag?: (...args: unknown[]) => void;
        dataLayer: unknown[];
        __marketingEvents: Array<{ granted: boolean }>;
      };

      anyWindow.gtag = cy.stub().as('gtag');
      anyWindow.dataLayer = [];
      anyWindow.__marketingEvents = [];
      win.addEventListener('mr-dj:marketing-consent-change', (event) => {
        anyWindow.__marketingEvents.push(event.detail as { granted: boolean });
      });
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

  it('controls social tracking scripts through marketing consent', () => {
    cy.window().then((win) => {
      const events = (win as typeof win & { __marketingEvents?: Array<{ granted: boolean }> }).__marketingEvents || [];
      const lastEvent = events[events.length - 1];
      expect(lastEvent).to.deep.equal({ granted: false });
    });

    cy.contains('Accept all').click();

    cy.window().then((win) => {
      const events = (win as typeof win & { __marketingEvents?: Array<{ granted: boolean }> }).__marketingEvents || [];
      const script = win.document.getElementById('mr-dj-facebook-pixel-script');
      const noscript = win.document.getElementById('mr-dj-facebook-pixel-noscript');
      expect(script, 'facebook pixel script is injected').to.exist;
      expect(noscript, 'facebook pixel noscript tag is injected').to.exist;
      expect(events).to.deep.include({ granted: true });
    });

    cy.contains('Cookie settings').should('be.visible').click();
    cy.contains('Cookie preferences').should('be.visible');

    cy.window().then((win) => {
      const typedWin = win as typeof win & { fbq: (...args: unknown[]) => void };
      expect(typedWin.fbq, 'facebook pixel queue exists').to.be.a('function');
      cy.spy(typedWin, 'fbq').as('fbqSpy');
    });

    cy.contains('Decline non-essential').click();

    cy.window().then((win) => {
      const events = (win as typeof win & { __marketingEvents?: Array<{ granted: boolean }> }).__marketingEvents || [];
      const script = win.document.getElementById('mr-dj-facebook-pixel-script');
      const noscript = win.document.getElementById('mr-dj-facebook-pixel-noscript');
      expect(script, 'facebook pixel script is removed').not.to.exist;
      expect(noscript, 'facebook pixel noscript tag is removed').not.to.exist;
      expect(events).to.deep.include({ granted: false });
    });

    cy.get('@fbqSpy').should('have.been.calledWith', 'consent', 'revoke');
  });
});
