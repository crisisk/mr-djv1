const { execFileSync } = require('child_process');
const path = require('path');
const { pathToFileURL } = require('url');

const repoRoot = path.resolve(__dirname, '../../..');
const analyticsModuleUrl = pathToFileURL(
  path.resolve(repoRoot, 'frontend/public/assets/js/modules/analytics.js')
).href;

describe('frontend analytics integration', () => {
  const runAnalyticsScript = () => {
    const script = `
      import { initAnalytics } from ${JSON.stringify(analyticsModuleUrl)};
      globalThis.window = { location: { href: 'https://staging.sevensa.nl/pricing/' } };
      globalThis.document = { title: 'Test Pagina' };
      const analytics = initAnalytics();
      analytics.trackAvailabilityStart({ event_type: 'bruiloft', city: 'Eindhoven' });
      analytics.trackAvailabilitySuccess({ event_type: 'bruiloft', city: 'Eindhoven' });
      analytics.trackLeadSubmitted({ source: 'pricing', step: 'contact' });
      analytics.trackBrochureDownload({ page: 'pricing', package_count: 4 });
      analytics.trackConsentUpdate({
        analytics_storage: 'granted',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        functionality_storage: 'granted'
      });
      console.log(JSON.stringify(globalThis.window.dataLayer));
    `;

    const output = execFileSync('node', ['--input-type=module', '-e', script], {
      encoding: 'utf-8',
    });

    return JSON.parse(output.trim());
  };

  it('registreert page view, availability en lead events', () => {
    const dataLayer = runAnalyticsScript();
    const events = dataLayer.map((entry) => entry.event);

    expect(events[0]).toBe('page_view');
    expect(events).toContain('availability_check_started');
    expect(events).toContain('availability_check_success');
    expect(events).toContain('lead_submitted');
    expect(events).toContain('pricing_brochure_download');

    const leadEvent = dataLayer.find((entry) => entry.event === 'lead_submitted');
    expect(leadEvent.source).toBe('pricing');
  });

  it('voegt consent_update met granular status toe', () => {
    const dataLayer = runAnalyticsScript();
    const consentEvent = dataLayer.find((entry) => entry.event === 'consent_update');

    expect(consentEvent).toMatchObject({
      analytics_storage: 'granted',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      functionality_storage: 'granted',
    });
  });
});
