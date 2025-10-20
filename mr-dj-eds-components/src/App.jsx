
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import React, { Suspense, useEffect } from 'react';
import { getOrAssignVariant, pushVariantToGTM } from './utils/abTesting.js';
// Use React.lazy for code splitting to improve initial load time (T6: Performance)
const DjSaxLanding = React.lazy(() => import('./components/Templates/DjSaxLanding.jsx'));
const LocalSeoPage = React.lazy(() => import('./components/Templates/LocalSeoPage.jsx'));
const PricingTables = React.lazy(() => import('./components/Organisms/PricingTables.jsx'));
const Testimonials = React.lazy(() => import('./components/Organisms/Testimonials.jsx'));

// Main service pages
const BruiloftDJPage = React.lazy(() => import('./pages/BruiloftDJPage.jsx'));
const BedrijfsfeestDJPage = React.lazy(() => import('./pages/BedrijfsfeestDJPage.jsx'));
const FeestDJPage = React.lazy(() => import('./pages/FeestDJPage.jsx'));
const VerhuurPage = React.lazy(() => import('./pages/VerhuurPage.jsx'));

// Info pages
const OverOnsPage = React.lazy(() => import('./pages/OverOnsPage.jsx'));
const FAQPage = React.lazy(() => import('./pages/FAQPage.jsx'));
const ContactPage = React.lazy(() => import('./pages/ContactPage.jsx'));

// Legal pages
const PrivacyPolicyPage = React.lazy(() => import('./pages/PrivacyPolicyPage.jsx'));
const CookiePolicyPage = React.lazy(() => import('./pages/CookiePolicyPage.jsx'));
const TermsConditionsPage = React.lazy(() => import('./pages/TermsConditionsPage.jsx'));
const CookieConsent = React.lazy(() => import('./components/Molecules/CookieConsent.jsx'));
const WhatsAppButton = React.lazy(() => import('./components/Atoms/WhatsAppButton.jsx'));
import { getLocalSeoDataBySlug } from './data/local_seo_data.js';
import { getLocalSeoBruiloftDataBySlug } from './data/local_seo_bruiloft_data.js';
import './App.css';

// Component to handle dynamic data fetching and rendering for local SEO pages
// T12: A/B Testing Framework - Automatic assignment with cookie persistence
// Moved to utils/abTesting.js for better organization

const LocalSeoPageWrapper = () => {
  const { citySlug } = useParams();
  const location = useLocation();

  let data = null;
  const normalizedSlug = citySlug ? citySlug.toLowerCase() : '';
  const isBruiloftPage = location.pathname.startsWith('/bruiloft-dj-');
  const fullSlug = isBruiloftPage ? `bruiloft-dj-${normalizedSlug}` : normalizedSlug;

  // T11: SEA Setup - Placeholder for tracking parameter logic
  // In a real application, you would parse the URL for tracking parameters (e.g., utm_source, gclid)
  // and potentially store them in a state management system or dataLayer.
  const urlParams = new URLSearchParams(location.search);
  if (isBruiloftPage) {
    // For Bruiloft DJ pages, append the prefix expected by the dataset (e.g., bruiloft-dj-eindhoven)
    data = getLocalSeoBruiloftDataBySlug(fullSlug);
  } else {
    // For general DJ pages, the slug is just the city name (e.g., eindhoven)
    data = getLocalSeoDataBySlug(fullSlug);
  }

  if (!data) {
    // In a real app, this would be a 404 page
    return <div className="p-10 text-center text-red-500">404 - Pagina voor stad "{citySlug}" niet gevonden.</div>;
  }

  return (
    <LocalSeoPage
      data={data}
      pricingSection={<PricingTables />}
      testimonialsSection={<Testimonials />}
      // T12: A/B Testing - Pass the variant to the component for conditional rendering
      variant={getOrAssignVariant()}
    />
  );
};

function App() {
  // T12: A/B Testing - Automatic assignment with cookie persistence and GTM tracking
  useEffect(() => {
    // Get or assign variant on app mount
    const variant = getOrAssignVariant();

    // Push to GTM dataLayer for tracking
    pushVariantToGTM(variant);
  }, []); // Run once on mount

  return (
    <div className="min-h-screen bg-white">
      <Suspense fallback={<div className="p-10 text-center text-xl">Laden...</div>}>
        <Routes>
          {/* Homepage - DJ + Sax landing page */}
          <Route path="/" element={<DjSaxLanding />} />

          {/* Main Service Pages */}
          <Route path="/bruiloft-dj" element={<BruiloftDJPage />} />
          <Route path="/bedrijfsfeest-dj" element={<BedrijfsfeestDJPage />} />
          <Route path="/zakelijk" element={<BedrijfsfeestDJPage />} />
          <Route path="/feest-dj" element={<FeestDJPage />} />
          <Route path="/verhuur" element={<VerhuurPage />} />

          {/* Dynamic Local SEO Pages - General DJ */}
          <Route path="/dj-in-:citySlug" element={<LocalSeoPageWrapper />} />

          {/* Dynamic Local SEO Pages - Bruiloft DJ */}
          <Route path="/bruiloft-dj-:citySlug" element={<LocalSeoPageWrapper />} />

          {/* Info Pages */}
          <Route path="/over-ons" element={<OverOnsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Legal Pages */}
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/cookie-policy" element={<CookiePolicyPage />} />
          <Route path="/algemene-voorwaarden" element={<TermsConditionsPage />} />

          {/* 404 Fallback */}
          <Route path="*" element={<div className="p-10 text-center">Pagina niet gevonden. <a href="/" className="text-blue-500 underline">Terug naar home</a></div>} />
        </Routes>
      </Suspense>

      {/* T1.2: GDPR Cookie Consent Banner - Shows on all pages */}
      <Suspense
        fallback={(
          <div
            aria-hidden="true"
            className="fixed bottom-0 left-0 right-0 h-0 pointer-events-none"
          />
        )}
      >
        <CookieConsent />
      </Suspense>

      {/* WhatsApp Floating Button - Available on all pages */}
      <Suspense
        fallback={(
          <div
            aria-hidden="true"
            className="fixed bottom-6 right-6 h-12 w-12 rounded-full pointer-events-none"
          />
        )}
      >
        <WhatsAppButton />
      </Suspense>
    </div>
  );
}

export default App
