// components/GoogleBusinessProfile.jsx

import React from 'react';
import Head from 'next/head';

const GoogleBusinessProfile = () => {
  return (
    <>
      <Head>
        {/* Schema markup for Local Business */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "EntertainmentBusiness",
              "name": "Mr. DJ Premium Services",
              "image": "https://mrdj.com/images/logo.png",
              "description": "Professional DJ services for weddings, corporate events, and private parties in [City]",
              "@id": "https://mrdj.com",
              "url": "https://mrdj.com",
              "telephone": "+1-XXX-XXX-XXXX",
              "priceRange": "$$",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "123 Music Street",
                "addressLocality": "[City]",
                "addressRegion": "[State]",
                "postalCode": "12345",
                "addressCountry": "US"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": XX.XXXXX,
                "longitude": -XX.XXXXX
              },
              "openingHoursSpecification": {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": [
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday"
                ],
                "opens": "09:00",
                "closes": "21:00"
              }
            }
          `}
        </script>
      </Head>
    </>
  );
};

export default GoogleBusinessProfile;
