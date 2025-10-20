# Marketing Consent and Social Tracking Scripts

The consent framework now governs when third-party social tracking tools such as Facebook Pixel load.

- Facebook Pixel script and `<noscript>` beacon are injected only when marketing consent is granted. When consent is revoked the script nodes are removed and `fbq('consent', 'revoke')` is issued to disable tracking immediately.
- A custom browser event, `mr-dj:marketing-consent-change`, is dispatched whenever marketing consent toggles. Integrations like TikTok can listen for this event or use the `subscribeToMarketingConsent` helper exposed by `useConsent()`.
- Automated Cypress coverage in `tests/frontend/consent.cy.ts` verifies that marketing consent fully controls the Facebook Pixel lifecycle and the related events, ensuring future changes preserve GDPR compliance.

To integrate additional marketing platforms, subscribe to the marketing consent change event (either through the DOM event or the React helper) and mirror the Facebook implementation by loading and unloading scripts based on the granted flag.
