import React from 'react';
import HeroSection from '../Organisms/HeroSection.jsx';
import Button from '../Atoms/Buttons.jsx';
import { Helmet } from 'react-helmet';

const LocalSeoPage = ({ data, pricingSection, testimonialsSection, variant }) => {
  if (!data) {
    return <div>Geen lokale SEO data gevonden.</div>;
  }

  const { city, province, localUSP, localReviews, localVenues, seoTitle, seoDescription } = data;

  return (
    <div className="LocalSeoPage">
      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Mr. DJ - Uw DJ in ${city}",
              "image": "https://www.mrdj.nl/logo.png",
              "url": "https://www.mrdj.nl/dj-in-${data.slug}",
              "telephone": "+31850601234",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "${city}",
                "addressRegion": "${province}",
                "addressCountry": "NL"
              },
              "priceRange": "€€€",
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "250"
              },
              "servesCuisine": "Muziek",
              "hasMap": "https://www.google.com/maps/search/${city}+DJ"
            }
          `}
        </script>
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Event",
              "name": "Feest met DJ in ${city}",
              "startDate": "2025-12-31T20:00",
              "endDate": "2026-01-01T04:00",
              "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
              "eventStatus": "https://schema.org/EventScheduled",
              "location": {
                "@type": "Place",
                "name": "Diverse Locaties in ${city}",
                "address": {
                  "@type": "PostalAddress",
                  "addressLocality": "${city}",
                  "addressRegion": "${province}",
                  "addressCountry": "NL"
                }
              },
              "description": "${localUSP}",
              "organizer": {
                "@type": "Organization",
                "name": "Mr. DJ",
                "url": "https://www.mrdj.nl"
              }
            }
          `}
        </script>
      </Helmet>

      <HeroSection
        title={`Uw DJ voor Feesten in ${city}, ${province}`}
        subtitle={localUSP}
        ctaPrimaryText="Check Beschikbaarheid"
        ctaSecondaryText="Vraag Offerte Aan"
        backgroundClass="bg-primary"
        titleColor="text-neutral-light"
        subtitleColor="text-neutral-light"
      />

      <section className="bg-neutral-dark py-spacing-xl text-neutral-light">
        <div className="container mx-auto flex flex-col items-center gap-spacing-md px-spacing-md text-center md:flex-row md:justify-between md:text-left">
          <blockquote className="max-w-3xl text-font-size-body font-medium italic">
            “{localReviews}”
          </blockquote>
          <span className="rounded-full bg-secondary/20 px-spacing-md py-spacing-xs text-xs font-semibold uppercase tracking-wide text-secondary">
            Lokale review uit {city}
          </span>
        </div>
      </section>

      <section className="bg-neutral-light py-spacing-2xl">
        <div className="container mx-auto px-spacing-md text-center">
          <h2 className="mb-spacing-lg text-font-size-h2 font-bold text-neutral-dark">
            Bekend met de beste locaties in {city} en {province}
          </h2>
          <div className="flex flex-wrap justify-center gap-spacing-md">
            {localVenues.map((venue) => (
              <span
                key={venue}
                className="rounded-full bg-neutral-gray-100 px-spacing-md py-spacing-sm text-font-size-body text-neutral-dark shadow-sm"
              >
                {venue}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-neutral-gray-100 py-spacing-3xl">
        <div className="container mx-auto px-spacing-md">
          <h2 className="mb-spacing-lg text-center text-font-size-h2 font-extrabold text-neutral-dark">
            Wat klanten in {city} en {province} zeggen
          </h2>
          {testimonialsSection}
        </div>
      </section>

      {pricingSection}

      <section className="bg-neutral-light py-spacing-2xl">
        <div className="container mx-auto px-spacing-md text-center">
          <h2 className="mb-spacing-lg text-font-size-h3 font-bold text-neutral-dark">
            Ontdek Onze DJ Services in de Regio
          </h2>
          <div className="flex flex-wrap justify-center gap-spacing-md">
            <a href="/dj-in-tilburg" className="text-primary-500 underline hover:text-primary-700">
              DJ in Tilburg
            </a>
            <a href="/dj-in-breda" className="text-primary-500 underline hover:text-primary-700">
              DJ in Breda
            </a>
            <a href="/bruiloft-dj-eindhoven" className="text-primary-500 underline hover:text-primary-700">
              Bruiloft DJ in Eindhoven
            </a>
            <a href="/bruiloft-dj-maastricht" className="text-primary-500 underline hover:text-primary-700">
              Bruiloft DJ in Maastricht
            </a>
            {data.slug.startsWith('bruiloft-dj-') ? (
              <a
                href={`/dj-in-${data.slug.replace('bruiloft-dj-', '')}`}
                className="text-primary-500 underline hover:text-primary-700"
              >
                Algemene DJ Service in {city}
              </a>
            ) : (
              <a href={`/bruiloft-dj-${data.slug}`} className="text-primary-500 underline hover:text-primary-700">
                Bruiloft DJ Service in {city}
              </a>
            )}
          </div>
        </div>
      </section>

      <div className="bg-neutral-dark py-spacing-2xl text-center text-neutral-light">
        <h3 className="mb-spacing-md text-font-size-h2 font-bold">
          {variant === 'B'
            ? `Vraag vandaag nog een gratis offerte aan in ${city}!`
            : `Klaar voor een onvergetelijk feest in ${city} of ${province}?`}
        </h3>
        <Button variant="primary" size="lg">
          Vraag Nu een Offerte Aan
        </Button>
      </div>
    </div>
  );
};

export default LocalSeoPage;
