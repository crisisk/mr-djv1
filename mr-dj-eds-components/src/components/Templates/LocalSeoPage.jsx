import React from 'react';
import HeroSection from '../Organisms/HeroSection.jsx';
import Header from '../Molecules/Header.jsx';
import Footer from '../Organisms/Footer.jsx';
import { Helmet } from 'react-helmet';
import ContactForm from '../Organisms/ContactForm.jsx';
import {
  generateBreadcrumbSchema,
  generateEventSchema,
  generateLocalBusinessSchema,
  SITE_BASE_URL,
} from '../../utils/schemaOrg.js';
import { localSeoData } from '../../data/local_seo_data.js';
import { localSeoBruiloftData } from '../../data/local_seo_bruiloft_data.js';

const LocalSeoPage = ({ data, pricingSection, testimonialsSection, variant }) => {
  if (!data) {
    return <div>Geen lokale SEO data gevonden.</div>;
  }

  const { city, province, localUSP, localReviews, localVenues, seoTitle, seoDescription } = data;
  const isBruiloftPage = data.slug.startsWith('bruiloft-dj-');
  const canonicalPath = isBruiloftPage ? `/${data.slug}` : `/dj-in-${data.slug}`;
  const oppositeServicePath = isBruiloftPage
    ? `/dj-in-${data.slug.replace('bruiloft-dj-', '')}`
    : `/bruiloft-dj-${data.slug}`;

  const relatedPages = (isBruiloftPage ? localSeoBruiloftData : localSeoData)
    .filter((item) => item.slug !== data.slug)
    .slice(0, 6);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    {
      name: isBruiloftPage ? 'Bruiloft DJ' : 'DJ Diensten',
      url: isBruiloftPage ? '/bruiloft-dj' : '/feest-dj',
    },
    { name: `DJ in ${city}`, url: canonicalPath },
  ];

  return (
    <div className="LocalSeoPage">
      {/* Header with Logo and Navigation */}
      <Header />

      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`${SITE_BASE_URL}${canonicalPath}`} />
        <script type="application/ld+json">
          {JSON.stringify(
            generateLocalBusinessSchema({
              city,
              province,
              slug: data.slug,
              path: canonicalPath,
            }),
          )}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(
            generateEventSchema({
              name: `Feest met DJ in ${city}`,
              description: localUSP,
              city,
              province,
            }),
          )}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(generateBreadcrumbSchema(breadcrumbs))}
        </script>
      </Helmet>

      {/* 1. Hero Section - Dynamic Title */}
      <HeroSection
        title={`Uw DJ voor Feesten in ${city}, ${province}`}
        subtitle={localUSP}
        ctaPrimaryText="Check Beschikbaarheid"
        ctaSecondaryText="Vraag Offerte Aan"
        backgroundClass="bg-primary"
        titleColor="text-white"
        subtitleColor="text-white"
      />

      {/* 2. Local Venues Section */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6">
            Bekend met de beste locaties in {city} en {province}
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {localVenues.slice(0, 8).map((venue, index) => (
              <span
                key={index}
                className="bg-gray-100 text-[#1A2C4B] px-4 py-2 rounded-full text-base shadow-sm"
              >
                {venue}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Localized Testimonials */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl text-center text-[#1A2C4B] mb-6 font-extrabold">
            Wat klanten in {city} en {province} zeggen
          </h2>
          <div className="max-w-3xl mx-auto mb-10 bg-white rounded-2xl shadow-lg p-8 text-left">
            <p className="text-lg text-[#1A2C4B] leading-relaxed italic">“{localReviews}”</p>
            <p className="mt-4 text-sm uppercase tracking-widest text-primary font-semibold">
              Lokale review uit {city}
            </p>
          </div>
          {/* Testimonials component is reused, but content should be filtered/localized in a real app */}
          {testimonialsSection}
        </div>
      </section>

      {/* 4. Pricing Section */}
      {pricingSection}

      {/* 5. Internal Linking Section (T10: SEO Fine-tune) */}
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-[#1A2C4B] mb-6">
            Ontdek Onze DJ Services in de Regio
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {relatedPages.map((page) => {
              const path = page.slug.startsWith('bruiloft-dj-')
                ? `/${page.slug}`
                : `/dj-in-${page.slug}`;
              return (
                <a
                  key={page.slug}
                  href={path}
                  className="text-primary-500 hover:text-primary-700 underline"
                >
                  {page.slug.startsWith('bruiloft-dj-')
                    ? `Bruiloft DJ in ${page.city}`
                    : `DJ in ${page.city}`}
                </a>
              );
            })}
            <a
              href={oppositeServicePath}
              className="text-primary-500 hover:text-primary-700 underline"
            >
              {isBruiloftPage
                ? `Algemene DJ Service in ${city}`
                : `Bruiloft DJ Service in ${city}`}
            </a>
          </div>
        </div>
      </section>

      {/* 6. Contact Form Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 max-w-3xl">
          <ContactForm variant={variant} eventType={isBruiloftPage ? 'bruiloft' : ''} />
        </div>
      </section>

      {/* 7. Footer CTA - Localized */}
      <div className="bg-[#1A2C4B] text-white py-12 text-center">
        <h3 className="text-4xl font-bold mb-4">
          {/* T12: A/B Test - Variant B uses a different CTA text */}
          {variant === 'B'
            ? `Vraag vandaag nog een gratis offerte aan in ${city}!`
            : `Klaar voor een onvergetelijk feest in ${city} of ${province}?`}
        </h3>
        <p className="text-white mb-4">
          Bel ons direct op{' '}
          <a href="tel:+31408422594" className="font-bold underline hover:text-secondary">
            +31 (0) 40 8422594
          </a>
        </p>
      </div>

      {/* 8. Footer */}
      <Footer />
    </div>
  );
};

export default LocalSeoPage;
