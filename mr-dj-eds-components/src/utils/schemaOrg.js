/**
 * Schema.org Structured Data Utilities
 *
 * This module provides helper functions to generate JSON-LD structured data
 * for various Schema.org types used throughout the Mr. DJ website.
 *
 * Usage:
 * Import the needed schema generator and include it in your Helmet component:
 *
 * <Helmet>
 *   <script type="application/ld+json">
 *     {JSON.stringify(generateOrganizationSchema())}
 *   </script>
 * </Helmet>
 */

import { BILLING_MODES } from '../data/pricingPackages.js';

const BASE_URL = 'https://mr-dj.sevensa.nl';
const BUSINESS_NAME = 'Mr. DJ';
const BUSINESS_PHONE = '+31408422594';
const BUSINESS_EMAIL = 'info@mr-dj.nl';
const LOGO_URL = `${BASE_URL}/images/logo.png`;

/**
 * Organization Schema
 * Main business/company schema - should be on every page
 */
export const generateOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": BUSINESS_NAME,
  "url": BASE_URL,
  "logo": LOGO_URL,
  "description": "Dé Feestspecialist van het Zuiden. DJ + Saxofoon voor bruiloften, bedrijfsfeesten en meer.",
  "telephone": BUSINESS_PHONE,
  "email": BUSINESS_EMAIL,
  "address": {
    "@type": "PostalAddress",
    "addressRegion": "Noord-Brabant",
    "addressCountry": "NL"
  },
  "sameAs": [
    "https://www.facebook.com/mrdj.nl",
    "https://www.instagram.com/mrdj.nl",
    "https://www.linkedin.com/company/mrdj-nl"
  ],
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "500",
    "bestRating": "5",
    "worstRating": "1"
  }
});

/**
 * LocalBusiness Schema
 * For location-specific pages (city landing pages)
 */
export const SITE_BASE_URL = BASE_URL;

export const generateLocalBusinessSchema = ({ city, province, slug, path }) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": `${BUSINESS_NAME} - DJ in ${city}`,
  "image": LOGO_URL,
  "url": `${BASE_URL}${path || `/dj-in-${slug}`}`,
  "telephone": BUSINESS_PHONE,
  "email": BUSINESS_EMAIL,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": city,
    "addressRegion": province,
    "addressCountry": "NL"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "addressCountry": "NL"
  },
  "priceRange": "€€€",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "500",
    "bestRating": "5",
    "worstRating": "1"
  },
  "areaServed": {
    "@type": "City",
    "name": city,
    "containedInPlace": {
      "@type": "AdministrativeArea",
      "name": province
    }
  },
  "hasOfferCatalog": {
    "@type": "OfferCatalog",
    "name": "DJ Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Bruiloft DJ",
          "description": "Professionele DJ voor uw bruiloft"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Bedrijfsfeest DJ",
          "description": "DJ voor zakelijke evenementen"
        }
      },
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Feest DJ",
          "description": "DJ voor verjaardagen en privé-feesten"
        }
      }
    ]
  }
});

/**
 * Event Schema
 * For DJ service events (can be used on service pages)
 */
export const generateEventSchema = ({ name, description, city, province, startDate, endDate }) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  "name": name || `Feest met DJ in ${city}`,
  "description": description,
  "startDate": startDate || new Date().toISOString(),
  "endDate": endDate,
  "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
  "eventStatus": "https://schema.org/EventScheduled",
  "location": {
    "@type": "Place",
    "name": city ? `Diverse Locaties in ${city}` : "Diverse Locaties",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": city,
      "addressRegion": province,
      "addressCountry": "NL"
    }
  },
  "offers": {
    "@type": "Offer",
    "url": BASE_URL,
    "availability": "https://schema.org/InStock",
    "validFrom": new Date().toISOString()
  },
  "performer": {
    "@type": "MusicGroup",
    "name": BUSINESS_NAME,
    "url": BASE_URL
  },
  "organizer": {
    "@type": "Organization",
    "name": BUSINESS_NAME,
    "url": BASE_URL
  }
});

/**
 * BreadcrumbList Schema
 * For site navigation structure
 */
export const generateBreadcrumbSchema = (breadcrumbs) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url.startsWith('http') ? crumb.url : `${BASE_URL}${crumb.url}`
  }))
});

/**
 * Service Schema
 * For specific service pages (Bruiloft DJ, Zakelijk, etc.)
 */
export const generateServiceSchema = ({ serviceName, description, serviceType }) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  "serviceType": serviceType || serviceName,
  "provider": {
    "@type": "Organization",
    "name": BUSINESS_NAME,
    "url": BASE_URL,
    "telephone": BUSINESS_PHONE
  },
  "name": serviceName,
  "description": description,
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
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.9",
    "reviewCount": "500"
  },
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/InStock",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "priceCurrency": "EUR",
      "price": "0",
      "description": "Prijzen op aanvraag"
    }
  }
});

const DEFAULT_AVAILABILITY = 'https://schema.org/InStock';

const joinUrl = (base, path = '') => {
  if (!path) {
    return `${base}/`;
  }

  if (path === '/') {
    return `${base}/`;
  }

  return `${base}${path.startsWith('/') ? path : `/${path}`}`;
};

const stripTrailingSlash = (value) =>
  typeof value === 'string' && value.endsWith('/') ? value.slice(0, -1) : value;

const normalizeSlug = (pkg) => {
  if (pkg?.slug) {
    return pkg.slug;
  }

  if (pkg?.id) {
    return String(pkg.id);
  }

  return String(pkg?.name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
};

const mapPriceSpecifications = (pricing = {}) =>
  Object.entries(pricing).map(([mode, price]) => ({
    "@type": "UnitPriceSpecification",
    price: price?.amount ?? null,
    priceCurrency: 'EUR',
    unitText: mode === BILLING_MODES.MONTHLY ? 'Per maand' : 'Per event',
    description: price?.description,
  }));

export const generateOfferCatalogSchema = ({
  packages = [],
  pagePath = '',
  baseUrl = BASE_URL,
  includeContext = true,
  id,
} = {}) => {
  const catalogUrlWithSlash = joinUrl(baseUrl, pagePath);
  const catalogUrl = stripTrailingSlash(
    pagePath && pagePath !== '/' ? catalogUrlWithSlash : baseUrl,
  );
  const catalogId = id || `${catalogUrl}#offers`;

  const itemListElement = packages.map((pkg) => {
    const slug = normalizeSlug(pkg);
    const offerId = `${catalogId}-${slug}`;
    const primaryPrice =
      pkg?.pricing?.[BILLING_MODES.EVENT] || Object.values(pkg?.pricing || {})[0] || {};
    const offerUrl = pkg?.ctaPath
      ? stripTrailingSlash(joinUrl(baseUrl, pkg.ctaPath))
      : `${catalogUrlWithSlash}#${slug}`;

    return {
      "@type": "Offer",
      "@id": offerId,
      name: `${pkg.name} Pakket`,
      availability: pkg.availability || DEFAULT_AVAILABILITY,
      url: offerUrl,
      priceCurrency: 'EUR',
      price: primaryPrice.amount ?? null,
      priceSpecification: mapPriceSpecifications(pkg.pricing),
      itemOffered: {
        "@type": pkg.schemaType || 'Service',
        name: pkg.serviceName || `${pkg.name} DJ Pakket`,
        description: pkg.subtitle,
      },
    };
  });

  const catalog = {
    "@type": "OfferCatalog",
    "@id": catalogId,
    name: 'DJ Pakketten',
    url: catalogUrlWithSlash,
    itemListElement,
  };

  if (includeContext) {
    catalog['@context'] = 'https://schema.org';
  }

  return catalog;
};

/**
 * Review/Rating Schema
 * For testimonials and reviews
 */
export const generateReviewSchema = ({ reviewBody, author, ratingValue, datePublished }) => ({
  "@context": "https://schema.org",
  "@type": "Review",
  "itemReviewed": {
    "@type": "LocalBusiness",
    "name": BUSINESS_NAME,
    "url": BASE_URL
  },
  "author": {
    "@type": "Person",
    "name": author
  },
  "datePublished": datePublished,
  "reviewBody": reviewBody,
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": ratingValue,
    "bestRating": "5",
    "worstRating": "1"
  }
});

/**
 * FAQ Schema
 * For FAQ pages
 */
export const generateFAQSchema = (faqs) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": faqs.map(faq => ({
    "@type": "Question",
    "name": faq.question,
    "acceptedAnswer": {
      "@type": "Answer",
      "text": faq.answer
    }
  }))
});

/**
 * WebPage Schema
 * Generic webpage schema for all pages
 */
export const generateWebPageSchema = ({ title, description, url, breadcrumbs }) => {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": title,
    "description": description,
    "url": url,
    "publisher": {
      "@type": "Organization",
      "name": BUSINESS_NAME,
      "logo": {
        "@type": "ImageObject",
        "url": LOGO_URL
      }
    },
    "inLanguage": "nl-NL"
  };

  if (breadcrumbs && breadcrumbs.length > 0) {
    schema.breadcrumb = generateBreadcrumbSchema(breadcrumbs);
  }

  return schema;
};

/**
 * Product Schema (for DJ packages/pricing)
 */
export const generateProductSchema = ({ name, description, price, priceCurrency = 'EUR' }) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": name,
  "description": description,
  "brand": {
    "@type": "Brand",
    "name": BUSINESS_NAME
  },
  "offers": {
    "@type": "Offer",
    "url": BASE_URL,
    "priceCurrency": priceCurrency,
    "price": price,
    "priceValidUntil": new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split('T')[0],
    "availability": "https://schema.org/InStock",
    "seller": {
      "@type": "Organization",
      "name": BUSINESS_NAME
    }
  }
});

// Export all schema generators
export default {
  generateOrganizationSchema,
  generateLocalBusinessSchema,
  generateEventSchema,
  generateBreadcrumbSchema,
  generateServiceSchema,
  generateReviewSchema,
  generateFAQSchema,
  generateWebPageSchema,
  generateProductSchema
};
