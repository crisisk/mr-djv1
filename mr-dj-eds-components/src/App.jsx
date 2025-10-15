
import { Routes, Route, useParams } from 'react-router-dom';
import Button from './components/Atoms/Buttons.jsx';
import DjSaxLanding from './components/Templates/DjSaxLanding.jsx';
import LocalSeoPage from './components/Templates/LocalSeoPage.jsx';
import PricingTables from './components/Organisms/PricingTables.jsx';
import Testimonials from './components/Organisms/Testimonials.jsx';
import { localSeoData, getLocalSeoDataBySlug } from './data/local_seo_data.js';
import './App.css'

// Component to handle dynamic data fetching and rendering for local SEO pages
const LocalSeoPageWrapper = () => {
  const { citySlug } = useParams();
  const data = getLocalSeoDataBySlug(citySlug);

  if (!data) {
    // In a real app, this would be a 404 page
    return <div className="p-10 text-center text-red-500">404 - Pagina voor stad "{citySlug}" niet gevonden.</div>;
  }

  return (
    <LocalSeoPage
      data={data}
      pricingSection={<PricingTables />}
      testimonialsSection={<Testimonials />}
    />
  );
};

function App() {
  return (
    <div className="min-h-screen bg-neutral-light">
      <Routes>
        {/* Route for the main DJ + Sax landing page */}
        <Route path="/" element={<DjSaxLanding />} />

        {/* Dynamic route for local SEO pages */}
        {/* The path is set to a common pattern like /dj-in-city-slug */}
        <Route path="/dj-in-:citySlug" element={<LocalSeoPageWrapper />} />

        {/* Fallback route for demonstration - can be removed later */}
        <Route path="*" element={<div className="p-10 text-center">Welkom bij Mr. DJ! Gebruik de URL /dj-in-eindhoven om de SEO pagina te zien.</div>} />
      </Routes>
    </div>
  );
}

export default App
