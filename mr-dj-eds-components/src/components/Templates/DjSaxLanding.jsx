import React from 'react';
import { Helmet } from 'react-helmet';
import Button from '../Atoms/Buttons.jsx';
import Header from '../Molecules/Header.jsx';
import HeroSection from '../Organisms/HeroSection.jsx';
import PricingTables from '../Organisms/PricingTables.jsx';
import AvailabilityChecker from '../Organisms/AvailabilityChecker.jsx';
import Testimonials from '../Organisms/Testimonials.jsx';
import ContactForm from '../Organisms/ContactForm.jsx';
import QuickCallbackForm from '../Organisms/QuickCallbackForm.jsx';
import AboutUs from '../Organisms/AboutUs.jsx';
import Footer from '../Organisms/Footer.jsx';
import TrustBadges from '../Molecules/TrustBadges.jsx';
import { Icon } from '../../icons/index.jsx';
import {
  generateOrganizationSchema,
  generateServiceSchema,
  generateBreadcrumbSchema,
  generateWebPageSchema,
  generateOfferCatalogSchema,
} from '../../utils/schemaOrg.js';
import { pricingPackages } from '../../data/pricingPackages.js';



// Stats/Achievements Section
const StatsSection = () => {
    const stats = [
        { number: "15", label: "jaar met 100% dansgarantie", icon: "icon-private-party" },
        { number: "2500+", label: "geslaagde feesten verzorgd", icon: "icon-sparkles" },
    ];

    return (
        <div className="py-spacing-2xl bg-primary">
            <div className="container mx-auto px-spacing-md">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-xl text-center">
                    {stats.map((stat, index) => (
                        <div key={index} className="text-neutral-light">
                            <span className="text-font-size-h1 block mb-spacing-sm">
                                <Icon name={stat.icon} size={64} className="mx-auto text-neutral-light" />
                            </span>
                            <div className="text-font-size-h1 font-bold mb-spacing-xs">Al {stat.number}</div>
                            <div className="text-font-size-h3">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

// Main intro text section
const IntroSection = () => {
    return (
        <div className="py-spacing-3xl bg-neutral-light">
            <div className="container mx-auto px-spacing-md max-w-4xl text-center">
                <p className="text-font-size-h3 text-neutral-dark leading-relaxed">
                    Heb je iets te vieren? Of heb je gewoon zin in een lekker feestje met vrienden, familie of collega's?
                    Dan ben je bij Mister DJ aan het juiste adres! Als dé feestspecialist van het zuiden zorgen wij ervoor
                    dat jouw feest onvergetelijk wordt. Of het nu gaat om een bruiloft, verjaardag, bedrijfsfeest of gewoon
                    een gezellige avond – wij maken er altijd een knallend feest van!
                </p>
            </div>
        </div>
    );
};

// Features Section with new content
const DjSaxFeatures = () => {
    const features = [
        {
            title: "Persoonlijk en op maat",
            icon: "icon-music",
            description: "Elk feest is uniek, en daarom krijg je bij ons een op maat gemaakt programma. We luisteren naar jouw wensen en zorgen ervoor dat de muziek en sfeer precies passen bij jouw feest en gasten."
        },
        {
            title: "Professioneel tot in de puntjes",
            icon: "icon-star",
            description: "Met ruim 15 jaar ervaring weten we precies hoe we jouw feest tot een succes maken. Van de apparatuur tot de uitvoering, alles is van topkwaliteit. Je hoeft je nergens zorgen over te maken!"
        },
        {
            title: "Keigezellig en 100% dansgarantie",
            icon: "icon-dancer",
            description: "Bij ons staat gezelligheid voorop! We zorgen voor de juiste vibes, zodat iedereen de dansvloer op gaat. Met onze jarenlange ervaring garanderen we dat jouw feest een hit wordt waar iedereen nog lang over napraat."
        },
    ];

    return (
        <div className="py-spacing-3xl bg-white">
            <div className="container mx-auto px-spacing-md">
                <h2 className="text-font-size-h2 font-bold text-primary mb-spacing-2xl text-center">Waarom Mister DJ?</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-xl">
                    {features.map((feature, index) => (
                        <div key={index} className="p-spacing-lg shadow-lg rounded-lg bg-neutral-light">
                            <span className="text-font-size-h1 block mb-spacing-md">
                                <Icon name={feature.icon} size={56} className="text-primary" />
                            </span>
                            <h3 className="text-font-size-h3 font-bold text-neutral-dark mb-spacing-sm">{feature.title}</h3>
                            <p className="text-font-size-body text-neutral-dark">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


const DjSaxLanding = ({ variant = 'A' }) => {
  // Variant-specific CTA text (P0 fix - removed misleading "Bekijk Video")
  const ctaPrimaryText = variant === 'B' ? 'Boek Nu' : 'Vraag Offerte Aan';
  const ctaSecondaryText = variant === 'B' ? 'Check Beschikbaarheid' : 'Bel Direct';

  // Define breadcrumbs for schema
  const breadcrumbs = [
    { name: 'Home', url: '/' }
  ];

  // Generate schemas
  const organizationSchema = generateOrganizationSchema();
  const offerCatalogSchema = generateOfferCatalogSchema({
    packages: pricingPackages,
    pagePath: '/',
  });
  const serviceSchema = {
    ...generateServiceSchema({
      serviceName: 'DJ + Saxofoon Service',
      description: 'Professionele DJ gecombineerd met live saxofonist voor bruiloften, bedrijfsfeesten en privé-evenementen',
      serviceType: 'Entertainment Service',
    }),
    '@id': 'https://mr-dj.sevensa.nl/#service',
    offers: {
      '@id': offerCatalogSchema['@id'],
    },
  };
  const breadcrumbSchema = generateBreadcrumbSchema(breadcrumbs);
  const webPageSchema = generateWebPageSchema({
    title: 'Mr. DJ - Dé Feestspecialist van het Zuiden',
    description: 'DJ + Saxofoon - De ultieme live ervaring voor uw feest',
    url: 'https://mr-dj.sevensa.nl/',
    breadcrumbs
  });
  const reviewSchemas = testimonials.map((testimonial) =>
    generateReviewSchema({
      reviewBody: testimonial.reviewBody,
      author: testimonial.author,
      ratingValue: testimonial.rating,
      datePublished: testimonial.datePublished,
    })
  );

  return (
    <div className="DjSaxLanding">
      <Helmet>
        <title>Mr. DJ - Dé Feestspecialist van het Zuiden | DJ + Saxofoon</title>
        <meta name="description" content="DJ + Saxofoon - De ultieme live ervaring voor uw feest. Boek nu de perfecte combinatie van een top-DJ en live saxofonist voor bruiloften, bedrijfsfeesten en meer in Noord-Brabant en Limburg." />

        {/* Schema.org Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(serviceSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(offerCatalogSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(webPageSchema)}
        </script>
        {reviewSchemas.map((schema, index) => (
          <script key={`review-schema-${index}`} type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        ))}
      </Helmet>

      {/* Header with Logo and Navigation */}
      <Header />

      {/* 1. Hero Section (Using Reusable Component) */}
      <HeroSection
        title="Mister DJ – Dé feestspecialist van het zuiden"
        subtitle="Alles voor jouw perfecte feest - Persoonlijk en op maat - Professioneel tot in de puntjes"
        ctaPrimaryText={ctaPrimaryText}
        ctaSecondaryText={ctaSecondaryText}
        backgroundImage="/images/dj-setups/dj-sax-combo.webp"
        variant={variant}
      />

      {/* 2. Trust Badges - Build immediate credibility (P0 improvement) */}
      <TrustBadges />

      {/* 3. Stats/Achievements Section */}
      <StatsSection />

      {/* 4. Main Intro Text Section */}
      <IntroSection />

      {/* 5. Features/USP Section */}
      <DjSaxFeatures />

      {/* 6. Testimonials Section - Moved above fold (P0 improvement) */}
      <Testimonials />

      {/* 7. Quick Callback Form - Simplified conversion (P0 improvement) */}
      <section className="py-spacing-3xl bg-neutral-gray-100">
        <div className="container mx-auto px-spacing-md max-w-xl">
          <QuickCallbackForm variant={variant} />
        </div>
      </section>

      {/* 8. About Us Section */}
      <AboutUs />

      {/* 9. Pricing Section (Reusing Organism) */}
      <div className="py-spacing-3xl">
        <h2 className="text-font-size-h2 text-center text-neutral-dark mb-spacing-2xl font-extrabold">
          Onze Pakketten met Sax
        </h2>
        <PricingTables />
      </div>

      {/* 10. Availability Checker (Reusing Organism) */}
      <AvailabilityChecker />

      {/* 11. Full Contact Form Section (for detailed inquiries) */}
      <section className="py-spacing-3xl bg-white">
        <div className="container mx-auto px-spacing-md max-w-3xl">
          <h2 className="text-font-size-h2 text-center text-neutral-dark mb-spacing-2xl font-extrabold">
            Gedetailleerde Offerteaanvraag
          </h2>
          <ContactForm variant={variant} />
        </div>
      </section>

      {/* 10. Call to Action (Simple Footer CTA) */}
      <div className="bg-primary text-neutral-light py-spacing-2xl text-center">
        <h2 className="text-font-size-h2 font-bold mb-spacing-md">Klaar voor de show?</h2>
        <p className="text-neutral-light mb-spacing-lg">
          Bel ons direct op{' '}
          <a
            href="tel:+31408422594"
            className="font-bold underline hover:text-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-neutral-light focus-visible:ring-offset-primary"
            aria-label="Bel Mister DJ op telefoonnummer +31 (0) 40 842 2594"
          >
            +31 (0) 40 8422594
          </a>
        </p>
      </div>

      {/* 11. Footer */}
      <Footer />
    </div>
  );
};

export default DjSaxLanding;
