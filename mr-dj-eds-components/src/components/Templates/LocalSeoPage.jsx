import React from 'react';
import HeroSection from '../Organisms/HeroSection.jsx';
import PricingTables from '../Organisms/PricingTables.jsx';
import Testimonials from '../Organisms/Testimonials.jsx';
import Button from '../Atoms/Buttons.jsx';
import { Helmet } from 'react-helmet';

// The component will receive the data via props from the router/App.jsx

const LocalSeoPage = ({ data }) => {
        if (!data) {
        return <div>Geen lokale SEO data gevonden.</div>;
    }

    const { city, province, localUSP, localReviews, localVenues, seoTitle, seoDescription } = data;

    return (
                <div className="LocalSeoPage">
            <Helmet>
                <title>{seoTitle}</title>
                <meta name="description" content={seoDescription} />
                <meta property="og:title" content={seoTitle} />
                <meta property="og:description" content={seoDescription} />
                <meta name="twitter:title" content={seoTitle} />
                <meta name="twitter:description" content={seoDescription} />
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
                        {/* Stronger SEO content here, mentioning the service and city again */}
                        De Beste DJ Service in ${city} en heel ${province}
                    </h2>
                    <p className="text-font-size-lg text-neutral-dark mb-spacing-xl">
                        Wij zijn bekend met de beste trouw- en feestlocaties in ${city}, waaronder:
                    </p>
                        
                    </h2>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-spacing-md">
                        {localVenues.map((venue, index) => (
                                                        <div key={index} className="bg-neutral-gray-100 text-neutral-dark p-spacing-md rounded-lg text-font-size-body shadow-md hover:shadow-lg transition duration-300">
                                <p className="font-semibold">{venue}</p>
                            </div>
                                {venue}
                            
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Localized Testimonials */}
            <section className="py-spacing-3xl bg-neutral-gray-100">
                <div className="container mx-auto px-spacing-md">
                                        <h2 className="text-font-size-h2 text-center text-neutral-dark mb-spacing-lg font-extrabold">
                        Echte Ervaringen van Klanten in ${city}
                    </h2>
                    <blockquote className="text-font-size-xl italic text-neutral-dark-600 mb-spacing-lg max-w-3xl mx-auto">
                        "{localReviews}"
                    </blockquote>
                        
                    </h2>
                                        {/* Testimonials component is reused, but in a real app, this would be filtered/localized content */}
                    <Testimonials />
                </div>
            </section>

            {/* 4. Pricing Section */}
            <PricingTables />

            {/* 5. Footer CTA - Localized */}
            <div className="bg-neutral-dark text-neutral-light py-spacing-2xl text-center">
                                <h3 className="text-font-size-h2 font-bold mb-spacing-md">
                    Klaar voor een onvergetelijk feest in ${city} of ${province}?
                </h3>
                <p className="text-font-size-lg mb-spacing-lg">
                    Vraag nu vrijblijvend een offerte aan en check direct de beschikbaarheid.
                </p>
                    
                </h3>
                <Button variant="primary" size="lg">
                    Vraag Nu een Offerte Aan
                </Button>
            </div>
        </div>
    );
};

export default LocalSeoPage;
