import React from 'react';
import { Helmet } from 'react-helmet';
import Button from '../Atoms/Buttons.jsx';
import Header from '../Molecules/Header.jsx';
import HeroSection from '../Organisms/HeroSection.jsx';
import PricingTables from '../Organisms/PricingTables.jsx';
import AvailabilityChecker from '../Organisms/AvailabilityChecker.jsx';
import Testimonials from '../Organisms/Testimonials.jsx';
import ContactForm from '../Organisms/ContactForm.jsx';
import AboutUs from '../Organisms/AboutUs.jsx';
import Footer from '../Organisms/Footer.jsx';



// Placeholder for a simple Feature Section
const DjSaxFeatures = () => {
    const features = [
        { title: "Live Interactie", icon: "🎤", description: "De saxofonist beweegt zich tussen de gasten voor een onvergetelijke beleving." },
        { title: "Unieke Sound", icon: "🎷", description: "Een unieke mix van elektronische beats en organische, live-gespeelde melodieën." },
        { title: "All-in Prijs", icon: "💰", description: "Geen verborgen kosten. Alles is inbegrepen in de offerte." },
    ];

    return (
        <div className="py-spacing-3xl bg-neutral-light">
            <div className="container mx-auto px-spacing-md text-center">
                <h2 className="text-font-size-h2 font-bold text-primary mb-spacing-2xl">Waarom DJ + Sax?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-xl">
                    {features.map((feature, index) => (
                        <div key={index} className="p-spacing-lg shadow-lg rounded-lg">
                            <span className="text-font-size-h1 block mb-spacing-md">{feature.icon}</span>
                            <h3 className="text-font-size-h3 font-bold text-neutral-dark mb-spacing-sm">{feature.title}</h3>
                            <p className="text-font-size-body text-neutral-dark">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const DjSaxLanding = () => {
  return (
    <div className="DjSaxLanding">
      <Helmet>
        <title>Mister DJ - Dé Feestspecialist van het Zuiden</title>
        <meta name="description" content="DJ + Saxofoon - De ultieme live ervaring voor uw feest. Boek nu de perfecte combinatie van een top-DJ en live saxofonist voor bruiloften, bedrijfsfeesten en meer in Noord-Brabant en Limburg." />
      </Helmet>

      {/* Header with Logo and Navigation */}
      <Header />

      {/* 1. Hero Section (Using Reusable Component) */}
      <HeroSection
        title="DJ + SAXOFOON: De Ultieme Live Ervaring"
        subtitle="Verhoog de energie van uw feest met de perfecte combinatie van een top-DJ en een live saxofonist."
        ctaPrimaryText="Bekijk Video"
        ctaSecondaryText="Vraag Prijs Aan"
      />

      {/* 2. Features/USP Section */}
      <DjSaxFeatures />

      {/* 3. About Us Section */}
      <AboutUs />

      {/* 4. Testimonials Section */}
      <Testimonials />

      {/* 5. Pricing Section (Reusing Organism) */}
      <div className="py-spacing-3xl">
        <h2 className="text-font-size-h2 text-center text-neutral-dark mb-spacing-2xl font-extrabold">
          Onze Pakketten met Sax
        </h2>
        <PricingTables />
      </div>

      {/* 6. Availability Checker (Reusing Organism) */}
      <AvailabilityChecker />

      {/* 7. Contact Form Section */}
      <section className="py-spacing-3xl bg-neutral-gray-100">
        <div className="container mx-auto px-spacing-md max-w-3xl">
          <ContactForm variant="A" />
        </div>
      </section>

      {/* 8. Call to Action (Simple Footer CTA) */}
      <div className="bg-primary text-neutral-light py-spacing-2xl text-center">
        <h3 className="text-font-size-h2 font-bold mb-spacing-md">Klaar voor de show?</h3>
        <p className="text-neutral-light mb-spacing-lg">
          Bel ons direct op <a href="tel:+31408422594" className="font-bold underline hover:text-secondary">+31 (0) 40 8422594</a>
        </p>
      </div>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
};

export default DjSaxLanding;
