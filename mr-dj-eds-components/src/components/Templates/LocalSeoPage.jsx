import React from 'react';
import HeroSection from '../Organisms/HeroSection.jsx';

import Button from '../Atoms/Buttons.jsx';
import { Helmet } from 'react-helmet';



const LocalSeoPage = ({ data, pricingSection, testimonialsSection }) => {
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
            {/* 1. Hero Section - Dynamic Title */}
            <HeroSection
                title={`Uw DJ voor Feesten in ${city}, ${province}`}
                subtitle={localUSP}
                ctaPrimaryText="Check Beschikbaarheid"
                ctaSecondaryText="Vraag Offerte Aan"
                backgroundClass="bg-primary"
                titleColor="text-neutral-light"
                subtitleColor="text-neutral-light"
            />

            {/* 2. Local Venues Section */}
            <section className="py-spacing-2xl bg-neutral-light">
                <div className="container mx-auto px-spacing-md text-center">
                    <h2 className="text-font-size-h2 font-bold text-neutral-dark mb-spacing-lg">
                        Bekend met de beste locaties in {city} en {province}
                    </h2>
                    <div className="flex justify-center space-x-spacing-lg">
                        {localVenues.map((venue, index) => (
                            <span key={index} className="bg-neutral-gray-100 text-neutral-dark px-spacing-md py-spacing-sm rounded-full text-font-size-body shadow-sm">
                                {venue}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Localized Testimonials */}
            <section className="py-spacing-3xl bg-neutral-gray-100">
                <div className="container mx-auto px-spacing-md">
                    <h2 className="text-font-size-h2 text-center text-neutral-dark mb-spacing-lg font-extrabold">
                        Wat klanten in {city} en {province} zeggen
                    </h2>
                    {/* Testimonials component is reused, but content should be filtered/localized in a real app */}
                    {testimonialsSection}
                </div>
            </section>

            {/* 4. Pricing Section */}
            {pricingSection}

            {/* 5. Footer CTA - Localized */}
            <div className="bg-neutral-dark text-neutral-light py-spacing-2xl text-center">
                <h3 className="text-font-size-h2 font-bold mb-spacing-md">
                    Klaar voor een onvergetelijk feest in {city} of {province}?
                </h3>
                <Button variant="primary" size="lg">
                    Vraag Nu een Offerte Aan
                </Button>
            </div>
        </div>
    );
};

export default LocalSeoPage;
