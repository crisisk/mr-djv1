import { socialLinkUrls } from '../config/socialLinks';

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
  "sameAs": socialLinkUrls,
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
