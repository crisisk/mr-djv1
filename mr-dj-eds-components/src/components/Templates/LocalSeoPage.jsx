import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../Molecules/Header.jsx';
import HeroSection from '../Organisms/HeroSection.jsx';
import Footer from '../Organisms/Footer.jsx';
import ContactForm from '../Organisms/ContactForm.jsx';
import { useHeroImage } from '../../hooks/useReplicateImage.js';
import { localSeoData, getLocalSeoDataBySlug } from '../../data/local_seo_data.js';
import { localSeoBruiloftData, getLocalSeoBruiloftDataBySlug } from '../../data/local_seo_bruiloft_data.js';
import { getWindow } from '../../lib/environment.js';

const LocalSeoPage = ({ data, pricingSection, testimonialsSection, variant }) => {
  const hasData = Boolean(data);
  const city = hasData ? data.city : '';
  const province = hasData ? data.province : '';
  const localUSP = hasData ? data.localUSP : '';
  const localReviews = hasData ? data.localReviews : '';
  const localVenues = hasData ? data.localVenues : [];
  const seoTitle = hasData ? data.seoTitle : 'Mister DJ - Lokale DJ';
  const seoDescription = hasData
    ? data.seoDescription
    : 'Mr. DJ verzorgt feesten door heel Nederland met 100% dansgarantie.';
  const slug = hasData ? data.slug : '';
  const isBruiloftPage = hasData && slug.startsWith('bruiloft-dj-');
  const counterpartSlug = isBruiloftPage ? slug.replace('bruiloft-dj-', '') : `bruiloft-dj-${slug}`;
  const generalSlug = isBruiloftPage ? counterpartSlug : slug;
  const eventType = isBruiloftPage ? 'bruiloft' : 'feest';

  const { imageUrl: heroImage, isLoading: heroImageLoading, error: heroImageError } = useHeroImage({
    city,
    eventType,
    autoGenerate: hasData && Boolean(city),
  });

  const fallbackHeroImage = useMemo(
    () => (isBruiloftPage ? '/images/events/hero-bruiloft-dj.webp' : '/images/events/hero-feest-dj.webp'),
    [isBruiloftPage],
  );

  const heroBackgroundImage = heroImage || fallbackHeroImage;
  const heroTitle = isBruiloftPage ? `Uw Bruiloft DJ in ${city}, ${province}` : `Uw DJ voor Feesten in ${city}, ${province}`;

  const canonicalPath = hasData ? (isBruiloftPage ? `/${slug}` : `/dj-in-${slug}`) : '/';
  const browser = getWindow();
  const origin = browser?.location?.origin ?? 'https://www.mrdj.nl';
  const canonicalUrl = `${origin}${canonicalPath}`;

  const hasCounterpart = useMemo(() => {
    if (!hasData) {
      return false;
    }
    return isBruiloftPage
      ? Boolean(getLocalSeoDataBySlug(counterpartSlug))
      : Boolean(getLocalSeoBruiloftDataBySlug(counterpartSlug));
  }, [counterpartSlug, hasData, isBruiloftPage]);

  const relatedPages = useMemo(() => {
    if (!hasData) {
      return [];
    }

    const dataset = isBruiloftPage ? localSeoBruiloftData : localSeoData;
    const sameProvince = dataset.filter((item) => item.slug !== slug && item.province === province);
    const fallbackList = dataset.filter((item) => item.slug !== slug);
    const pool = sameProvince.length ? sameProvince : fallbackList;

    const mapped = pool.slice(0, 3).map((item) => ({
      label: `${isBruiloftPage ? 'Bruiloft DJ' : 'DJ'} in ${item.city}`,
      path: item.slug.startsWith('bruiloft-dj-') ? `/${item.slug}` : `/dj-in-${item.slug}`,
    }));

    if (hasCounterpart) {
      mapped.unshift({
        label: isBruiloftPage ? `DJ in ${city}` : `Bruiloft DJ in ${city}`,
        path: isBruiloftPage ? `/dj-in-${generalSlug}` : `/${counterpartSlug}`,
      });
    }

    return mapped;
  }, [city, counterpartSlug, generalSlug, hasCounterpart, hasData, isBruiloftPage, province, slug]);

  const localBusinessSchema = useMemo(() => {
    if (!hasData) {
      return null;
    }

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': `${canonicalUrl}#business`,
      name: `Mr. DJ - Uw DJ in ${city}`,
      image: `${origin}/images/logo.webp`,
      url: canonicalUrl,
      telephone: '+31850601234',
      address: {
        '@type': 'PostalAddress',
        addressLocality: city,
        addressRegion: province,
        addressCountry: 'NL',
      },
      priceRange: '€€€',
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: '4.9',
        reviewCount: '250',
      },
      areaServed: {
        '@type': 'City',
        name: city,
      },
      sameAs: [
        'https://www.facebook.com/mrdj',
        'https://www.instagram.com/misterdj',
      ],
    });
  }, [canonicalUrl, city, hasData, origin, province]);

  const eventSchema = useMemo(() => {
    if (!hasData) {
      return null;
    }

    return JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: `${isBruiloftPage ? 'Bruiloft' : 'Feest'} met DJ in ${city}`,
      startDate: '2025-12-31T20:00',
      endDate: '2026-01-01T04:00',
      eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
      eventStatus: 'https://schema.org/EventScheduled',
      location: {
        '@type': 'Place',
        name: `Diverse locaties in ${city}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: city,
          addressRegion: province,
          addressCountry: 'NL',
        },
      },
      description: localUSP,
      organizer: {
        '@type': 'Organization',
        name: 'Mr. DJ',
        url: origin,
      },
      url: canonicalUrl,
    });
  }, [canonicalUrl, city, hasData, isBruiloftPage, localUSP, origin, province]);

  if (!hasData) {
    return <div className="p-10 text-center text-red-500">Geen lokale SEO data gevonden.</div>;
  }

  return (
    <div className="LocalSeoPage">
      <Header />

      <Helmet>
        <title>{seoTitle}</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={canonicalUrl} />
        {localBusinessSchema && <script type="application/ld+json">{localBusinessSchema}</script>}
        {eventSchema && <script type="application/ld+json">{eventSchema}</script>}
      </Helmet>

      <HeroSection
        title={heroTitle}
        subtitle={localUSP}
        ctaPrimaryText="Check Beschikbaarheid"
        ctaSecondaryText="Vraag Offerte Aan"
        backgroundClass="bg-primary"
        titleColor="text-white"
        subtitleColor="text-white"
        backgroundImage={heroBackgroundImage}
      >
        {heroImageLoading && (
          <p className="mt-6 text-sm text-white/80" aria-live="polite">
            We genereren een unieke hero-afbeelding voor {city}...
          </p>
        )}
        {heroImageError && (
          <p className="mt-4 inline-flex rounded-full bg-black/50 px-4 py-2 text-xs text-red-100" role="status">
            Kon dynamische hero niet laden – we tonen onze standaardfoto.
          </p>
        )}
      </HeroSection>

      <section className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold text-[#1A2C4B]">
            Bekend met de beste locaties in {city} en {province}
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {localVenues.map((venue) => (
              <span key={venue} className="rounded-full bg-gray-100 px-4 py-2 text-base text-[#1A2C4B] shadow-sm">
                {venue}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-center text-4xl font-extrabold text-[#1A2C4B]">
            Wat klanten in {city} en {province} zeggen
          </h2>
          <div className="mt-8">{testimonialsSection}</div>
          {localReviews && (
            <blockquote className="mx-auto mt-10 max-w-3xl rounded-xl bg-white/70 p-6 text-center text-lg italic text-[#1A2C4B] shadow-md">
              “{localReviews}”
            </blockquote>
          )}
        </div>
      </section>

      {pricingSection}

      {relatedPages.length > 0 && (
        <section className="bg-white py-12">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-6 text-2xl font-bold text-[#1A2C4B]">Ontdek Onze DJ Services in de Regio</h2>
            <div className="flex flex-wrap justify-center gap-4">
              {relatedPages.map((item) => (
                <a key={item.path} href={item.path} className="text-primary-500 underline hover:text-primary-700">
                  {item.label}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-white py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <ContactForm variant={variant} eventType={isBruiloftPage ? 'bruiloft' : ''} />
        </div>
      </section>

      <div className="bg-[#1A2C4B] py-12 text-center text-white">
        <h3 className="mb-4 text-4xl font-bold">
          {variant === 'B'
            ? `Vraag vandaag nog een gratis offerte aan in ${city}!`
            : `Klaar voor een onvergetelijk feest in ${city} of ${province}?`}
        </h3>
        <p className="text-white">
          Bel ons direct op{' '}
          <a href="tel:+31408422594" className="font-bold underline hover:text-secondary">
            +31 (0) 40 8422594
          </a>
        </p>
      </div>

      <Footer />
    </div>
  );
};

export default LocalSeoPage;
