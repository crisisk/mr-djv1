import React from 'react';
import Head from 'next/head';

/**
 * Component to render structured data in JSON-LD format
 * @param {Object} props - Component props
 * @param {string} props.type - Schema type (Event, LocalBusiness, Review)
 * @param {Object} props.data - Data for the schema
 */
export const StructuredData = ({ type, data }) => {
  const getSchema = () => {
    switch (type) {
      case 'LocalBusiness':
        return {
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: data.name,
          image: data.image,
          '@id': data.url,
          url: data.url,
          telephone: data.phone,
          address: {
            '@type': 'PostalAddress',
            streetAddress: data.address.street,
            addressLocality: data.address.city,
            addressRegion: data.address.state,
            postalCode: data.address.zip,
            addressCountry: data.address.country,
          },
          geo: {
            '@type': 'GeoCoordinates',
            latitude: data.geo.latitude,
            longitude: data.geo.longitude,
          },
          priceRange: data.priceRange,
          openingHoursSpecification: data.openingHours,
          sameAs: data.socialLinks,
        };
      case 'Event':
        return {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: data.name,
          startDate: data.startDate,
          endDate: data.endDate,
          eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
          eventStatus: 'https://schema.org/EventScheduled',
          location: {
            '@type': 'Place',
            name: data.location.name,
            address: {
              '@type': 'PostalAddress',
              streetAddress: data.location.address.street,
              addressLocality: data.location.address.city,
              addressRegion: data.location.address.state,
              postalCode: data.location.address.zip,
              addressCountry: data.location.address.country,
            },
          },
          image: data.images,
          description: data.description,
          offers: {
            '@type': 'Offer',
            url: data.url,
            price: data.price,
            priceCurrency: data.priceCurrency,
            availability: data.availability,
            validFrom: data.validFrom,
          },
          performer: {
            '@type': 'PerformingGroup',
            name: 'Mr. DJ',
          },
        };
      case 'Review':
        return {
          '@context': 'https://schema.org',
          '@type': 'Review',
          itemReviewed: {
            '@type': 'LocalBusiness',
            name: data.businessName,
          },
          author: {
            '@type': 'Person',
            name: data.author,
          },
          datePublished: data.date,
          reviewBody: data.reviewBody,
          reviewRating: {
            '@type': 'Rating',
            ratingValue: data.rating,
            bestRating: '5',
            worstRating: '1',
          },
        };
      default:
        return null;
    }
  };

  const schema = getSchema();

  if (!schema) return null;

  return (
    <Head>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </Head>
  );
};
