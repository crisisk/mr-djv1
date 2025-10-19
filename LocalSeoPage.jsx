import React from 'react';
import HeroSection from '../Organisms/HeroSection.jsx';
import PricingTables from '../Organisms/PricingTables.jsx';
import Testimonials from '../Organisms/Testimonials.jsx';
import Button from '../Atoms/Buttons.jsx';

// Placeholder for dynamic content
const localData = {
    city: "Eindhoven",
    localUSP: "Dé beste DJ voor uw feest in Eindhoven en omgeving. Bekend met alle top-locaties zoals het Evoluon en de Effenaar.",
    localReviews: "Fantastische service in Eindhoven! De gasten waren laaiend enthousiast.",
    localVenues: ["Evoluon", "Effenaar", "Strijp-S"],
};

const LocalSeoPage = ({ data = localData }) => {
    const { city, localUSP, localReviews, localVenues } = data;

    return (
        <div className="LocalSeoPage">
            {/* 1. Hero Section - Dynamic Title */}
            <HeroSection
                title={`Uw DJ voor Feesten in ${city}`}
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
                        Bekend met de beste locaties in {city}
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
                        Wat klanten in {city} zeggen
                    </h2>
                    {/* Testimonials component is reused, but content should be filtered/localized in a real app */}
                    <Testimonials />
                </div>
            </section>

            {/* 4. Pricing Section */}
            <PricingTables />

            {/* 5. Footer CTA - Localized */}
            <div className="bg-neutral-dark text-neutral-light py-spacing-2xl text-center">
                <h3 className="text-font-size-h2 font-bold mb-spacing-md">
                    Klaar voor een onvergetelijk feest in {city}?
                </h3>
                <Button variant="primary" size="lg">
                    Vraag Nu een Offerte Aan
                </Button>
            </div>
        </div>
    );
};

export default LocalSeoPage;
