import React from 'react';
import HeroSection from './HeroSection.jsx';
import PricingTables from './PricingTables.jsx';
import Testimonials from './Testimonials.jsx';
import Button from './Buttons.jsx';
import { translate, getDefaultLocale } from './mr-dj-eds-components/src/lib/i18n.js';

// Placeholder for dynamic content
const localData = {
    city: "Eindhoven",
    localUSP: "Dé beste DJ voor uw feest in Eindhoven en omgeving. Bekend met alle top-locaties zoals het Evoluon en de Effenaar.",
    localReviews: "Fantastische service in Eindhoven! De gasten waren laaiend enthousiast.",
    localVenues: ["Evoluon", "Effenaar", "Strijp-S"],
};

const LocalSeoPage = ({ data = localData, locale = getDefaultLocale() }) => {
    const { city, localUSP, localReviews, localVenues } = data;

    const heroProvinceSuffix = '';
    const eventTypeTitle = translate('localSeo.hero.eventTypeGeneral', {
        locale,
        defaultValue: 'DJ voor feesten',
    });

    const heroTitle = translate('localSeo.hero.title', {
        locale,
        defaultValue: `Uw DJ voor Feesten in ${city}`,
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
        defaultValue: `Bekend met de beste locaties in ${city}`,
        params: {
            city,
            provinceSuffix: '',
        },
    });

    const testimonialsHeading = translate('localSeo.testimonials.heading', {
        locale,
        defaultValue: `Wat klanten in ${city} zeggen`,
        params: {
            city,
            provinceSuffix: '',
        },
    });

    const footerHeading = translate('localSeo.footer.heading', {
        locale,
        defaultValue: `Klaar voor een onvergetelijk feest in ${city}?`,
        params: {
            city,
            provinceSuffix: '',
        },
    });

    const footerCtaButton = translate('localSeo.footer.ctaButton', {
        locale,
        defaultValue: 'Vraag Nu een Offerte Aan',
    });

    return (
        <div className="LocalSeoPage">
            {/* 1. Hero Section - Dynamic Title */}
            <HeroSection
                title={heroTitle}
                subtitle={localUSP}
                ctaPrimaryText={heroPrimaryCta}
                ctaSecondaryText={heroSecondaryCta}
                backgroundClass="bg-primary"
                titleColor="text-neutral-light"
                subtitleColor="text-neutral-light"
            />

            {/* 2. Local Venues Section */}
            <section className="py-spacing-2xl bg-neutral-light">
                <div className="container mx-auto px-spacing-md text-center">
                    <h2 className="text-font-size-h2 font-bold text-neutral-dark mb-spacing-lg">
                        {venuesHeading}
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
                        {testimonialsHeading}
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
                    {footerHeading}
                </h3>
                <Button variant="primary" size="lg">
                    {footerCtaButton}
                </Button>
            </div>
        </div>
    );
};

export default LocalSeoPage;
