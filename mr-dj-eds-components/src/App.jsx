import { Routes, Route, useParams } from 'react-router-dom';
import React, { Suspense } from 'react';
import { getWindow } from './lib/environment.js';
// Use React.lazy for code splitting to improve initial load time (T6: Performance)
const DjSaxLanding = React.lazy(() => import('./components/Templates/DjSaxLanding.jsx'));
const LocalSeoPage = React.lazy(() => import('./components/Templates/LocalSeoPage.jsx'));
const PricingTables = React.lazy(() => import('./components/Organisms/PricingTables.jsx'));
const Testimonials = React.lazy(() => import('./components/Organisms/Testimonials.jsx'));
import { getLocalSeoDataBySlug } from './data/local_seo_data.js';
import { getLocalSeoBruiloftDataBySlug } from './data/local_seo_bruiloft_data.js';
import './App.css';

// Component to handle dynamic data fetching and rendering for local SEO pages
// T12: A/B Testing Framework - Simple URL parameter switch
const getVariant = () => {
  const browser = getWindow();
  if (!browser) {
    return 'A';
  }
  const urlParams = new URLSearchParams(browser.location.search);
  // Default to 'A' if no variant is specified
  return urlParams.get('variant') === 'B' ? 'B' : 'A';
};

const LocalSeoPageWrapper = () => {
  const { citySlug } = useParams();
  const browser = getWindow();
  const pathname = browser?.location?.pathname ?? '';

  let data = null;
  const isBruiloftPage = pathname.startsWith('/bruiloft-dj-');

  // T11: SEA Setup - Placeholder for tracking parameter logic
  // In a real application, you would parse the URL for tracking parameters (e.g., utm_source, gclid)
  // and potentially store them in a state management system or dataLayer.
  const urlParams = browser ? new URLSearchParams(browser.location.search) : new URLSearchParams();
  const trackingData = {
    utm_source: urlParams.get('utm_source'),
    gclid: urlParams.get('gclid'),
    // Add more tracking parameters as needed
  };

  if (browser && Object.values(trackingData).some(Boolean)) {
    try {
      browser.sessionStorage?.setItem('mr-dj-tracking-data', JSON.stringify(trackingData));
    } catch (error) {
      if (import.meta?.env?.DEV) {
        console.warn('[App] Kon trackingdata niet wegschrijven', error);
      }
    }
  }

  if (isBruiloftPage) {
    // For Bruiloft DJ pages, the slug is the full path segment (e.g., bruiloft-dj-eindhoven)
    data = getLocalSeoBruiloftDataBySlug(citySlug);
  } else {
    // For general DJ pages, the slug is just the city name (e.g., eindhoven)
    data = getLocalSeoDataBySlug(citySlug);
  }

  if (!data) {
    // In a real app, this would be a 404 page
    return (
      <div className="p-10 text-center text-red-500">
        404 - Pagina voor stad "{citySlug}" niet gevonden.
      </div>
    );
  }

  return (
    <LocalSeoPage
      data={data}
      pricingSection={<PricingTables />}
      testimonialsSection={<Testimonials />}
      // T12: A/B Testing - Pass the variant to the component for conditional rendering
      variant={getVariant()}
    />
  );
};

function App() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Suspense fallback={<div className="p-10 text-center text-xl">Laden...</div>}>
        <Routes>
          {/* Route for the main DJ + Sax landing page */}
          <Route path="/" element={<DjSaxLanding />} />

          {/* Dynamic route for general local SEO pages */}
          <Route path="/dj-in-:citySlug" element={<LocalSeoPageWrapper />} />

          {/* Dynamic route for Bruiloft DJ local SEO pages */}
          {/* The slug is the full path segment (e.g., bruiloft-dj-eindhoven) */}
          <Route path="/bruiloft-dj-:citySlug" element={<LocalSeoPageWrapper />} />

          {/* Fallback route for demonstration - can be removed later */}
          <Route
            path="*"
            element={
              <div className="p-10 text-center">
                Welkom bij Mr. DJ! Gebruik de URL /dj-in-eindhoven of /bruiloft-dj-eindhoven om de SEO pagina's te zien.
              </div>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
}

export default App;
