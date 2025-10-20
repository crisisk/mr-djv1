
import { Routes, Route, useParams, useLocation } from 'react-router-dom';
import React, { Suspense, useEffect, useState } from 'react';
import CookieConsent from './components/Molecules/CookieConsent.jsx';
import WhatsAppButton from './components/Atoms/WhatsAppButton.jsx';
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
import './App.css';

// Component to handle dynamic data fetching and rendering for local SEO pages
// T12: A/B Testing Framework - Automatic assignment with cookie persistence
// Moved to utils/abTesting.js for better organization

const LocalSeoPageSkeleton = () => (
  <div className="p-10">
    <div className="max-w-5xl mx-auto animate-pulse space-y-6">
      <div className="h-10 bg-gray-200 rounded" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-40 bg-gray-200 rounded" />
        <div className="h-40 bg-gray-200 rounded" />
        <div className="h-40 bg-gray-200 rounded" />
      </div>
      <div className="space-y-3">
        <div className="h-4 bg-gray-200 rounded" />
        <div className="h-4 bg-gray-200 rounded w-5/6" />
        <div className="h-4 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  </div>
);

const LocalSeoPageWrapper = () => {
  const { citySlug } = useParams();
  const location = useLocation();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    let isActive = true;

    const loadLocalSeoData = async () => {
      setStatus('loading');

      try {
        const isBruiloftPage = location.pathname.startsWith('/bruiloft-dj-');
        const normalizedSlug = (citySlug || '').toLowerCase();
        const dataModule = isBruiloftPage
          ? await import('./data/local_seo_bruiloft_data.js')
          : await import('./data/local_seo_data.js');

        const normalizeSlug = (slug) => slug.replace(/^bruiloft-dj-/, '');
        const slugWithoutPrefix = normalizeSlug(normalizedSlug);
        const lookupSlug = isBruiloftPage ? `bruiloft-dj-${slugWithoutPrefix}` : slugWithoutPrefix;

        const lookupFn = isBruiloftPage
          ? dataModule.getLocalSeoBruiloftDataBySlug
          : dataModule.getLocalSeoDataBySlug;

        const resolvedData = typeof lookupFn === 'function' ? lookupFn(lookupSlug) : null;

        if (!isActive) {
          return;
        }

        if (resolvedData) {
          setData(resolvedData);
          setStatus('ready');
        } else {
          setData(null);
          setStatus('not-found');
        }
      } catch (error) {
        console.error('Failed to load local SEO data', error);
        if (!isActive) {
          return;
        }
        setData(null);
        setStatus('not-found');
      }
    };

    loadLocalSeoData();

    return () => {
      isActive = false;
    };
  }, [citySlug, location.pathname]);

  if (status === 'loading') {
    return <LocalSeoPageSkeleton />;
  }

  if (status === 'not-found') {
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
