import React, { useMemo } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../Molecules/Header.jsx';
import HeroSection from '../Organisms/HeroSection.jsx';
import Footer from '../Organisms/Footer.jsx';
import ContactForm from '../Organisms/ContactForm.jsx';
import { useHeroImage } from '../../hooks/useReplicateImage.js';
import { localSeoData, getLocalSeoDataBySlug } from '../../data/local_seo_data.js';
import { localSeoBruiloftData, getLocalSeoBruiloftDataBySlug } from '../../data/local_seo_bruiloft_data.js';
import { pricingPackages } from '../../data/pricingPackages.js';
import { generateOfferCatalogSchema } from '../../utils/schemaOrg.js';
import { getWindow } from '../../lib/environment.js';
import { generateBreadcrumbSchema } from '../../utils/schemaOrg.js';
import { createLocalSeoBreadcrumbs } from '../../utils/breadcrumbs.js';

const LocalSeoPage = ({ data, pricingSection, testimonialsSection, variant, locale = getDefaultLocale() }) => {
  const hasData = Boolean(data);
  const city = hasData ? data.city : '';
  const province = hasData ? data.province : '';
  const localUSP = useMemo(
    () => (hasData ? resolveLocalizedValue(data.localUSP, locale) : ''),
    [data, hasData, locale],
  );
  const localReviews = useMemo(
    () => (hasData ? resolveLocalizedValue(data.localReviews, locale) : ''),
    [data, hasData, locale],
  );
  const localVenues = useMemo(
    () => (hasData ? resolveLocalizedList(data.localVenues, locale) : []),
    [data, hasData, locale],
  );
  const seoTitle = useMemo(
    () => (hasData ? resolveLocalizedValue(data.seoTitle, locale) : 'Mister DJ - Lokale DJ'),
    [data, hasData, locale],
  );
  const seoDescription = useMemo(
    () =>
      hasData
        ? resolveLocalizedValue(data.seoDescription, locale)
        : 'Mr. DJ verzorgt feesten door heel Nederland met 100% dansgarantie.',
    [data, hasData, locale],
  );
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
  const heroProvinceSuffix = province ? `, ${province}` : '';
  const venuesProvinceSuffix = province ? ` en ${province}` : '';
  const footerProvinceSuffix = province ? ` of ${province}` : '';
  const eventTypeTitle = translate(
    isBruiloftPage ? 'localSeo.hero.eventTypeWedding' : 'localSeo.hero.eventTypeGeneral',
    {
      locale,
      defaultValue: isBruiloftPage ? 'Bruiloft DJ' : 'DJ voor feesten',
    },
  );

  const heroTitle = translate('localSeo.hero.title', {
    locale,
    defaultValue: isBruiloftPage
      ? `Uw Bruiloft DJ in ${city}${heroProvinceSuffix}`
      : `Uw DJ voor Feesten in ${city}${heroProvinceSuffix}`,
    params: {
      city,
      provinceSuffix: heroProvinceSuffix,
      eventTypeTitle,
    },
  });

  const heroPrimaryCta = translate('localSeo.hero.ctaPrimary', {
    locale,
    defaultValue: 'Check Beschikbaarheid',
  });

  const heroSecondaryCta = translate('localSeo.hero.ctaSecondary', {
    locale,
    defaultValue: 'Vraag Offerte Aan',
  });

  const venuesHeading = translate('localSeo.venues.heading', {
    locale,
    defaultValue: `Bekend met de beste locaties in ${city}${venuesProvinceSuffix}`,
    params: {
      city,
      provinceSuffix: venuesProvinceSuffix,
    },
  });

  const testimonialsHeading = translate('localSeo.testimonials.heading', {
    locale,
    defaultValue: `Wat klanten in ${city}${venuesProvinceSuffix} zeggen`,
    params: {
      city,
      provinceSuffix: venuesProvinceSuffix,
    },
  });

  const footerHeading = translate(
    variant === 'B' ? 'localSeo.footer.variantBHeading' : 'localSeo.footer.heading',
    {
      locale,
      defaultValue:
        variant === 'B'
          ? `Vraag vandaag nog een gratis offerte aan in ${city}!`
          : `Klaar voor een onvergetelijk feest in ${city}${footerProvinceSuffix}?`,
      params:
        variant === 'B'
          ? {
              city,
            }
          : {
              city,
              provinceSuffix: footerProvinceSuffix,
            },
    },
  );

  const footerCtaPrompt = translate('localSeo.footer.ctaPrompt', {
    locale,
    defaultValue: 'Bel ons direct op',
  });

  const footerCtaButton = translate('localSeo.footer.ctaButton', {
    locale,
    defaultValue: 'Vraag nu een offerte aan',
  });

  const canonicalPath = hasData ? (isBruiloftPage ? `/${slug}` : `/dj-in-${slug}`) : '/';
  const browser = getWindow();
  const origin = browser?.location?.origin ?? 'https://www.mrdj.nl';
  const canonicalUrl = `${origin}${canonicalPath}`;

  const offerCatalogSchema = useMemo(
    () =>
      generateOfferCatalogSchema({
        packages: pricingPackages,
        pagePath: canonicalPath,
      }),
    [canonicalPath],
  );

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

  const reviewSchemas = testimonials.map((testimonial) =>
    JSON.stringify(
      generateReviewSchema({
        reviewBody: testimonial.reviewBody,
        author: testimonial.author,
        ratingValue: testimonial.rating,
        datePublished: testimonial.datePublished,
      })
    )
  );

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
      offers: offerCatalogSchema ? { '@id': offerCatalogSchema['@id'] } : undefined,
    });
  }, [canonicalUrl, city, hasData, isBruiloftPage, localUSP, offerCatalogSchema, origin, province]);

  const breadcrumbs = useMemo(() => {
    if (!hasData) {
      return [];
    }

    return createLocalSeoBreadcrumbs({
      city,
      slug,
      isBruiloft: isBruiloftPage,
    });
  }, [city, hasData, isBruiloftPage, slug]);

  const breadcrumbSchema = useMemo(() => {
    if (!breadcrumbs.length) {
      return null;
    }

    return JSON.stringify(generateBreadcrumbSchema(breadcrumbs));
  }, [breadcrumbs]);

  const serviceSchema = useMemo(() => {
    if (!hasData) {
      return null;
    }

    const schema = generateServiceSchema({
      serviceName: isBruiloftPage ? `Bruiloft DJ Service ${city}` : `DJ Service ${city}`,
      description: seoDescription,
      serviceType: isBruiloftPage ? 'Wedding Entertainment' : 'Event Entertainment',
    });

    if (schema?.offers?.priceSpecification) {
      const price = isBruiloftPage ? '1295' : '995';
      const label = isBruiloftPage
        ? 'Bruiloft DJ pakketten vanaf €1.295'
        : 'DJ pakketten vanaf €995';

      schema.offers.priceSpecification.price = price;
      schema.offers.priceSpecification.description = label;
    }

    return JSON.stringify(schema);
  }, [city, hasData, isBruiloftPage, seoDescription]);

  const breadcrumbSchema = useMemo(
    () => JSON.stringify(generateBreadcrumbSchema(breadcrumbs)),
    [breadcrumbs],
  );

  const webPageSchema = useMemo(
    () =>
      JSON.stringify(
        generateWebPageSchema({
          title: seoTitle,
          description: seoDescription,
          url: canonicalUrl,
          breadcrumbs,
        }),
      ),
    [breadcrumbs, canonicalUrl, seoDescription, seoTitle],
  );

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
        <script type="application/ld+json">{webPageSchema}</script>
        <script type="application/ld+json">{breadcrumbSchema}</script>
        {serviceSchema && <script type="application/ld+json">{serviceSchema}</script>}
        {localBusinessSchema && <script type="application/ld+json">{localBusinessSchema}</script>}
        {eventSchema && <script type="application/ld+json">{eventSchema}</script>}
        {breadcrumbSchema && <script type="application/ld+json">{breadcrumbSchema}</script>}
      </Helmet>

      <HeroSection
        title={heroTitle}
        subtitle={localUSP}
        ctaPrimaryText={heroPrimaryCta}
        ctaSecondaryText={heroSecondaryCta}
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
          <h2 className="mb-6 text-4xl font-bold text-[#1A2C4B]">{venuesHeading}</h2>
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
          <h2 className="text-center text-4xl font-extrabold text-[#1A2C4B]">{testimonialsHeading}</h2>
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
        <h3 className="mb-4 text-4xl font-bold">{footerHeading}</h3>
        <p className="text-white">
          {footerCtaPrompt}{' '}
          <a href="tel:+31408422594" className="font-bold underline hover:text-secondary">
            +31 (0) 40 8422594
          </a>
        </p>
        <div className="mt-6 flex justify-center">
          <a
            href="/contact"
            className="inline-flex items-center rounded-full bg-white px-6 py-3 text-lg font-semibold text-[#1A2C4B] shadow-md transition hover:bg-gray-100"
          >
            {footerCtaButton}
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LocalSeoPage;
