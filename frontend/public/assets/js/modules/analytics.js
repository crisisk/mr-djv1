const ISODate = () => new Date().toISOString();

export const initAnalytics = () => {
  if (!window.dataLayer) {
    window.dataLayer = [];
  }

  const push = (event, detail = {}) => {
    window.dataLayer.push({
      event,
      event_timestamp: ISODate(),
      ...detail,
    });
  };

  const trackAvailabilityStart = (detail) => push('availability_check_started', detail);
  const trackAvailabilitySuccess = (detail) => push('availability_check_success', detail);
  const trackLeadSubmitted = (detail) => push('lead_submitted', detail);
  const trackPackageView = (detail) => push('package_view', detail);
  const trackPackageCTA = (detail) => push('package_cta_click', detail);
  const trackBrochureDownload = (detail) => push('pricing_brochure_download', detail);
  const trackPersonaFocus = (detail) => push('persona_focus', detail);
  const trackSocialProofImpression = (detail) => push('testimonial_impression', detail);
  const trackSocialProofClick = (detail) => push('testimonial_cta_click', detail);

  // expose helper for ConsentManager sync
  const trackConsentUpdate = (detail) => push('consent_update', detail);

  push('page_view', {
    page_location: window.location.href,
    page_title: document.title,
  });

  return {
    track: push,
    trackAvailabilityStart,
    trackAvailabilitySuccess,
    trackLeadSubmitted,
    trackPackageView,
    trackPackageCTA,
    trackBrochureDownload,
    trackPersonaFocus,
    trackSocialProofImpression,
    trackSocialProofClick,
    trackConsentUpdate,
  };
};
