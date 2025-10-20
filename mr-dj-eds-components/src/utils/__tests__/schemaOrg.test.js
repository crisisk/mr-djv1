import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateEventSchema,
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateReviewSchema,
  generateFAQSchema,
  generateWebPageSchema,
  generateProductSchema
} from '../schemaOrg.js';

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2025-01-15T12:00:00Z'));
});

afterEach(() => {
  vi.useRealTimers();
});

describe('schemaOrg generators', () => {
  it('creates the organization schema baseline', () => {
    expect(generateOrganizationSchema()).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "Organization",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "NL",
          "addressRegion": "Noord-Brabant"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "bestRating": "5",
          "ratingValue": "4.9",
          "reviewCount": "500",
          "worstRating": "1"
        },
        "description": "Dé Feestspecialist van het Zuiden. DJ + Saxofoon voor bruiloften, bedrijfsfeesten en meer.",
        "email": "info@mr-dj.nl",
        "logo": "https://mr-dj.sevensa.nl/images/logo.png",
        "name": "Mr. DJ",
        "sameAs": [
          "https://www.facebook.com/mrdj.nl",
          "https://www.instagram.com/mrdj.nl",
          "https://www.linkedin.com/company/mrdj-nl"
        ],
        "telephone": "+31408422594",
        "url": "https://mr-dj.sevensa.nl"
      }
    `);
  });

  it('supports custom slug and path when generating local business schema', () => {
    expect(
      generateLocalBusinessSchema({
        city: 'Eindhoven',
        province: 'Noord-Brabant',
        slug: 'dj-eindhoven-nl',
        path: '/diensten/dj-eindhoven-nl'
      })
    ).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "address": {
          "@type": "PostalAddress",
          "addressCountry": "NL",
          "addressLocality": "Eindhoven",
          "addressRegion": "Noord-Brabant"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "bestRating": "5",
          "ratingValue": "4.9",
          "reviewCount": "500",
          "worstRating": "1"
        },
        "areaServed": {
          "@type": "City",
          "containedInPlace": {
            "@type": "AdministrativeArea",
            "name": "Noord-Brabant"
          },
          "name": "Eindhoven"
        },
        "email": "info@mr-dj.nl",
        "geo": {
          "@type": "GeoCoordinates",
          "addressCountry": "NL"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "description": "Professionele DJ voor uw bruiloft",
                "name": "Bruiloft DJ"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "description": "DJ voor zakelijke evenementen",
                "name": "Bedrijfsfeest DJ"
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Service",
                "description": "DJ voor verjaardagen en privé-feesten",
                "name": "Feest DJ"
              }
            }
          ],
          "name": "DJ Services"
        },
        "image": "https://mr-dj.sevensa.nl/images/logo.png",
        "name": "Mr. DJ - DJ in Eindhoven",
        "priceRange": "€€€",
        "telephone": "+31408422594",
        "url": "https://mr-dj.sevensa.nl/diensten/dj-eindhoven-nl"
      }
    `);
  });

  it('fills dynamic defaults for event schema', () => {
    expect(
      generateEventSchema({
        name: 'Mr. DJ Live Showcase',
        description: 'Avondvullend feest met DJ en saxofonist',
        city: 'Tilburg',
        province: 'Noord-Brabant',
        endDate: '2025-02-01T00:00:00.000Z'
      })
    ).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "Event",
        "description": "Avondvullend feest met DJ en saxofonist",
        "endDate": "2025-02-01T00:00:00.000Z",
        "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
          "@type": "Place",
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "NL",
            "addressLocality": "Tilburg",
            "addressRegion": "Noord-Brabant"
          },
          "name": "Diverse Locaties in Tilburg"
        },
        "name": "Mr. DJ Live Showcase",
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "url": "https://mr-dj.sevensa.nl",
          "validFrom": "2025-01-15T12:00:00.000Z"
        },
        "organizer": {
          "@type": "Organization",
          "name": "Mr. DJ",
          "url": "https://mr-dj.sevensa.nl"
        },
        "performer": {
          "@type": "MusicGroup",
          "name": "Mr. DJ",
          "url": "https://mr-dj.sevensa.nl"
        },
        "startDate": "2025-01-15T12:00:00.000Z"
      }
    `);
  });

  it('normalises breadcrumb URLs while respecting absolute links', () => {
    expect(
      generateBreadcrumbSchema([
        { name: 'Home', url: '/' },
        { name: 'DJ Services', url: '/diensten' },
        { name: 'External Feature', url: 'https://partner.example/dj' }
      ])
    ).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "item": "https://mr-dj.sevensa.nl/",
            "name": "Home",
            "position": 1
          },
          {
            "@type": "ListItem",
            "item": "https://mr-dj.sevensa.nl/diensten",
            "name": "DJ Services",
            "position": 2
          },
          {
            "@type": "ListItem",
            "item": "https://partner.example/dj",
            "name": "External Feature",
            "position": 3
          }
        ]
      }
    `);
  });

  it('structures service schema with provider and offers', () => {
    expect(
      generateServiceSchema({
        serviceName: 'Bruiloft DJ Deluxe',
        description: 'Compleet verzorgde avond met lichtshow en saxofonist',
        serviceType: 'Bruiloft'
      })
    ).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "Service",
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "500"
        },
        "areaServed": [
          {
            "@type": "State",
            "name": "Noord-Brabant"
          },
          {
            "@type": "State",
            "name": "Limburg"
          }
        ],
        "description": "Compleet verzorgde avond met lichtshow en saxofonist",
        "name": "Bruiloft DJ Deluxe",
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "priceSpecification": {
            "@type": "PriceSpecification",
            "description": "Prijzen op aanvraag",
            "price": "0",
            "priceCurrency": "EUR"
          }
        },
        "provider": {
          "@type": "Organization",
          "name": "Mr. DJ",
          "telephone": "+31408422594",
          "url": "https://mr-dj.sevensa.nl"
        },
        "serviceType": "Bruiloft"
      }
    `);
  });

  it('records reviews with rating metadata', () => {
    expect(
      generateReviewSchema({
        reviewBody: 'Fantastische avond! Muziek sloot perfect aan op onze gasten.',
        author: 'Sanne van Dijk',
        ratingValue: '5',
        datePublished: '2024-09-10'
      })
    ).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Sanne van Dijk"
        },
        "datePublished": "2024-09-10",
        "itemReviewed": {
          "@type": "LocalBusiness",
          "name": "Mr. DJ",
          "url": "https://mr-dj.sevensa.nl"
        },
        "reviewBody": "Fantastische avond! Muziek sloot perfect aan op onze gasten.",
        "reviewRating": {
          "@type": "Rating",
          "bestRating": "5",
          "ratingValue": "5",
          "worstRating": "1"
        }
      }
    `);
  });

  it('builds FAQ schema from Q&A pairs', () => {
    expect(
      generateFAQSchema([
        {
          question: 'Hoe lang draait de DJ?',
          answer: 'Een standaard set duurt 4 uur en is uitbreidbaar.'
        },
        {
          question: 'Kunnen we een verzoeknummer doorgeven?',
          answer: 'Zeker, stuur vooraf jullie favorieten door en we regelen het.'
        }
      ])
    ).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Een standaard set duurt 4 uur en is uitbreidbaar."
            },
            "name": "Hoe lang draait de DJ?"
          },
          {
            "@type": "Question",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Zeker, stuur vooraf jullie favorieten door en we regelen het."
            },
            "name": "Kunnen we een verzoeknummer doorgeven?"
          }
        ]
      }
    `);
  });

  it('combines webpage data with breadcrumb schema', () => {
    expect(
      generateWebPageSchema({
        title: 'Mr. DJ | Bruiloft DJ',
        description: 'Volledige DJ-beleving voor jullie trouwdag.',
        url: 'https://mr-dj.sevensa.nl/bruiloft',
        breadcrumbs: [
          { name: 'Home', url: '/' },
          { name: 'Bruiloften', url: '/bruiloft' },
          { name: 'Externe Inspiratie', url: 'https://partner.example/bruiloft-dj' }
        ]
      })
    ).toMatchInlineSnapshot(`
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
              "position": 1
            },
            {
              "@type": "ListItem",
              "item": "https://mr-dj.sevensa.nl/bruiloft",
              "name": "Bruiloften",
              "position": 2
            },
            {
              "@type": "ListItem",
              "item": "https://partner.example/bruiloft-dj",
              "name": "Externe Inspiratie",
              "position": 3
            }
          ]
        },
        "description": "Volledige DJ-beleving voor jullie trouwdag.",
        "inLanguage": "nl-NL",
        "name": "Mr. DJ | Bruiloft DJ",
        "publisher": {
          "@type": "Organization",
          "logo": {
            "@type": "ImageObject",
            "url": "https://mr-dj.sevensa.nl/images/logo.png"
          },
          "name": "Mr. DJ"
        },
        "url": "https://mr-dj.sevensa.nl/bruiloft"
      }
    `);
  });

  it('encapsulates product pricing with a rolling validity window', () => {
    expect(
      generateProductSchema({
        name: 'Bruiloft Pakket Premium',
        description: 'Incl. DJ, saxofonist en lichtshow',
        price: '1895',
        priceCurrency: 'EUR'
      })
    ).toMatchInlineSnapshot(`
      {
        "@context": "https://schema.org",
        "@type": "Product",
        "brand": {
          "@type": "Brand",
          "name": "Mr. DJ"
        },
        "description": "Incl. DJ, saxofonist en lichtshow",
        "name": "Bruiloft Pakket Premium",
        "offers": {
          "@type": "Offer",
          "availability": "https://schema.org/InStock",
          "price": "1895",
          "priceCurrency": "EUR",
          "priceValidUntil": "2026-01-15",
          "seller": {
            "@type": "Organization",
            "name": "Mr. DJ"
          },
          "url": "https://mr-dj.sevensa.nl"
        }
      }
    `);
  });
});
