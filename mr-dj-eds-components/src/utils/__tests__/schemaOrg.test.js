import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateEventSchema,
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateReviewSchema,
  generateFAQSchema,
  generateWebPageSchema,
  generateProductSchema,
  SITE_BASE_URL
} from '../schemaOrg.js';

const FIXED_DATE = new Date('2024-01-01T12:00:00.000Z');

describe('schemaOrg utilities', () => {
  beforeAll(() => {
    vi.useFakeTimers();
    vi.setSystemTime(FIXED_DATE);
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  it('generates organization schema', () => {
    const schema = generateOrganizationSchema();
    expect(schema).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "NL",
          "addressRegion": "Noord-Brabant",
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "bestRating": "5",
          "ratingValue": "4.9",
          "reviewCount": "500",
          "worstRating": "1",
        },
        "description": "Dé Feestspecialist van het Zuiden. DJ + Saxofoon voor bruiloften, bedrijfsfeesten en meer.",
        "email": "info@mr-dj.nl",
        "logo": "https://mr-dj.sevensa.nl/images/logo.png",
        "name": "Mr. DJ",
        "sameAs": [
          "https://www.facebook.com/mrdj.nl",
          "https://www.instagram.com/mrdj.nl",
          "https://www.linkedin.com/company/mrdj-nl",
        ],
        "telephone": "+31408422594",
        "url": "https://mr-dj.sevensa.nl",
      }
    `);
  });

  it('generates local business schema with custom path', () => {
    const schema = generateLocalBusinessSchema({
      city: 'Eindhoven',
      province: 'Noord-Brabant',
      slug: 'eindhoven',
      path: '/diensten/dj-eindhoven'
    });
    expect(schema).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "NL",
          "addressLocality": "Eindhoven",
          "addressRegion": "Noord-Brabant",
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "bestRating": "5",
          "ratingValue": "4.9",
          "reviewCount": "500",
          "worstRating": "1",
        },
        "areaServed": {
          "@type": "City",
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": "Noord-Brabant",
          },
          "name": "Eindhoven",
        },
        "email": "info@mr-dj.nl",
        "geo": {
          "@type": "GeoCoordinates",
          "addressCountry": "NL",
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "description": "Professionele DJ voor uw bruiloft",
                "name": "Bruiloft DJ",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "description": "DJ voor zakelijke evenementen",
                "name": "Bedrijfsfeest DJ",
              },
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "description": "DJ voor verjaardagen en privé-feesten",
                "name": "Feest DJ",
              },
            },
          ],
          "name": "DJ Services",
        },
        "image": "https://mr-dj.sevensa.nl/images/logo.png",
        "name": "Mr. DJ - DJ in Eindhoven",
        "priceRange": "€€€",
        "telephone": "+31408422594",
        "url": "https://mr-dj.sevensa.nl/diensten/dj-eindhoven",
      }
    `);
  });

  it('generates event schema with defaults', () => {
    const schema = generateEventSchema({
      name: 'Bedrijfsfeest',
      description: 'DJ voor bedrijfsfeest',
      city: 'Tilburg',
      province: 'Noord-Brabant',
      endDate: '2024-01-02T18:00:00.000Z'
    });
    expect(schema).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "Event",
        "description": "DJ voor bedrijfsfeest",
        "endDate": "2024-01-02T18:00:00.000Z",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "NL",
            "addressLocality": "Tilburg",
            "addressRegion": "Noord-Brabant",
          },
          "name": "Diverse Locaties in Tilburg",
        },
        "name": "Bedrijfsfeest",
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "url": "https://mr-dj.sevensa.nl",
          "validFrom": "2024-01-01T12:00:00.000Z",
        },
        "organizer": {
          "@type": "Organization",
          "name": "Mr. DJ",
          "url": "https://mr-dj.sevensa.nl",
        },
        "performer": {
          "@type": "MusicGroup",
          "name": "Mr. DJ",
          "url": "https://mr-dj.sevensa.nl",
        },
        "startDate": "2024-01-01T12:00:00.000Z",
      }
    `);
  });

  it('generates breadcrumb schema with absolute URLs', () => {
    const schema = generateBreadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Services', url: '/services' },
      { name: 'Extern', url: 'https://partner.example.com/dj' }
    ]);
    expect(schema).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "item": "https://mr-dj.sevensa.nl/",
            "name": "Home",
            "position": 1,
          },
          {
            "@type": "ListItem",
            "item": "https://mr-dj.sevensa.nl/services",
            "name": "Services",
            "position": 2,
          },
          {
            "@type": "ListItem",
            "item": "https://partner.example.com/dj",
            "name": "Extern",
            "position": 3,
          },
        ],
      }
    `);
  });

  it('generates service schema', () => {
    const schema = generateServiceSchema({
      serviceName: 'Bruiloft DJ',
      description: 'All-inclusive bruiloft DJ pakket',
      serviceType: 'WeddingService'
    });
    expect(schema).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "500",
        },
        "areaServed": [
          {
            "@type": "State",
            "name": "Noord-Brabant",
          },
          {
            "@type": "State",
            "name": "Limburg",
          },
        ],
        "description": "All-inclusive bruiloft DJ pakket",
        "name": "Bruiloft DJ",
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "description": "Prijzen op aanvraag",
            "price": "0",
            "priceCurrency": "EUR",
          },
        },
        "provider": {
          "@type": "Organization",
          "name": "Mr. DJ",
          "telephone": "+31408422594",
          "url": "https://mr-dj.sevensa.nl",
        },
        "serviceType": "WeddingService",
      }
    `);
  });

  it('generates review schema', () => {
    const schema = generateReviewSchema({
      reviewBody: 'Geweldige ervaring!',
      author: 'Sanne',
      ratingValue: '5',
      datePublished: '2024-01-01'
    });
    expect(schema).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sanne",
        },
        "datePublished": "2024-01-01",
        "itemReviewed": {
          "@type": "LocalBusiness",
          "name": "Mr. DJ",
          "url": "https://mr-dj.sevensa.nl",
        },
        "reviewBody": "Geweldige ervaring!",
        "reviewRating": {
          "@type": "Rating",
          "bestRating": "5",
          "ratingValue": "5",
          "worstRating": "1",
        },
      }
    `);
  });

  it('generates FAQ schema', () => {
    const schema = generateFAQSchema([
      { question: 'Hoe lang draait de DJ?', answer: 'Standaard 4 uur.' },
      { question: 'Is saxofonist inbegrepen?', answer: 'Optioneel bij te boeken.' }
    ]);
    expect(schema).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Standaard 4 uur.",
            },
            "name": "Hoe lang draait de DJ?",
          },
          {
            "@type": "Question",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Optioneel bij te boeken.",
            },
            "name": "Is saxofonist inbegrepen?",
          },
        ],
      }
    `);
  });

  it('generates webpage schema with breadcrumb reference', () => {
    const schema = generateWebPageSchema({
      title: 'Bruiloft DJ',
      description: 'DJ en saxofonist voor uw bruiloft.',
      url: `${SITE_BASE_URL}/bruiloft`,
      breadcrumbs: [
        { name: 'Home', url: '/' },
        { name: 'Bruiloft', url: '/bruiloft' }
      ]
    });
    expect(schema).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "breadcrumb": {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "item": "https://mr-dj.sevensa.nl/",
              "name": "Home",
              "position": 1,
            },
            {
              "@type": "ListItem",
              "item": "https://mr-dj.sevensa.nl/bruiloft",
              "name": "Bruiloft",
              "position": 2,
            },
          ],
        },
        "description": "DJ en saxofonist voor uw bruiloft.",
        "inLanguage": "nl-NL",
        "name": "Bruiloft DJ",
        "publisher": {
          "@type": "Organization",
          "logo": {
            "@type": "ImageObject",
            "url": "https://mr-dj.sevensa.nl/images/logo.png",
          },
          "name": "Mr. DJ",
        },
        "url": "https://mr-dj.sevensa.nl/bruiloft",
      }
    `);
  });

  it('generates product schema', () => {
    const schema = generateProductSchema({
      name: 'Bruiloft Pakket',
      description: 'Complete DJ + Sax show',
      price: '2499',
      priceCurrency: 'EUR'
    });
    expect(schema).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "brand": {
          "@type": "Brand",
          "name": "Mr. DJ",
        },
        "description": "Complete DJ + Sax show",
        "name": "Bruiloft Pakket",
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "price": "2499",
          "priceCurrency": "EUR",
          "priceValidUntil": "2025-01-01",
          "seller": {
            "@type": "Organization",
            "name": "Mr. DJ",
          },
          "url": "https://mr-dj.sevensa.nl",
        },
      }
    `);
  });
});
