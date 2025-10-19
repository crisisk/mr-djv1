import React from 'react';
import HeroSection from '../Organisms/HeroSection.jsx';
import Header from '../Molecules/Header.jsx';
import Footer from '../Organisms/Footer.jsx';
import Button from '../Atoms/Buttons.jsx';
import { Helmet } from 'react-helmet';
import ContactForm from '../Organisms/ContactForm.jsx';



const LocalSeoPage = ({ data, pricingSection, testimonialsSection, variant }) => {
        if (!data) {
        return <div>Geen lokale SEO data gevonden.</div>;
    }
    const { city, province, localUSP, localReviews, localVenues, seoTitle, seoDescription } = data;

    return (
                <div className="LocalSeoPage">
            {/* Header with Logo and Navigation */}
            <Header />

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
                titleColor="text-white"
                subtitleColor="text-white"
            />

            {/* 2. Local Venues Section */}
            <section className="py-12 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-4xl font-bold text-[#1A2C4B] mb-6">
                        Bekend met de beste locaties in {city} en {province}
                    </h2>
                    <div className="flex justify-center space-x-6">
                        {localVenues.map((venue, index) => (
                            <span key={index} className="bg-gray-100 text-[#1A2C4B] px-4 py-2 rounded-full text-base shadow-sm">
                                {venue}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* 3. Localized Testimonials */}
            <section className="py-16 bg-gray-100">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl text-center text-[#1A2C4B] mb-6 font-extrabold">
                        Wat klanten in {city} en {province} zeggen
                    </h2>
                    {/* Testimonials component is reused, but content should be filtered/localized in a real app */}
                    {testimonialsSection}
                </div>
            </section>

	            {/* 4. Pricing Section */}
	            {pricingSection}
	
	            {/* 5. Internal Linking Section (T10: SEO Fine-tune) */}
	            <section className="py-12 bg-white">
	                <div className="container mx-auto px-4 text-center">
	                    <h2 className="text-2xl font-bold text-[#1A2C4B] mb-6">
	                        Ontdek Onze DJ Services in de Regio
	                    </h2>
	                    <div className="flex flex-wrap justify-center gap-4">
	                        {/* Placeholder for dynamic internal links to other cities/pages */}
	                        <a href="/dj-in-tilburg" className="text-primary-500 hover:text-primary-700 underline">DJ in Tilburg</a>
	                        <a href="/dj-in-breda" className="text-primary-500 hover:text-primary-700 underline">DJ in Breda</a>
	                        <a href="/bruiloft-dj-eindhoven" className="text-primary-500 hover:text-primary-700 underline">Bruiloft DJ in Eindhoven</a>
	                        <a href="/bruiloft-dj-maastricht" className="text-primary-500 hover:text-primary-700 underline">Bruiloft DJ in Maastricht</a>
	                        {/* Add a link to the opposite service type for the current city */}
	                        {data.slug.startsWith('bruiloft-dj-') ? (
	                            <a href={`/dj-in-${data.slug.replace('bruiloft-dj-', '')}`} className="text-primary-500 hover:text-primary-700 underline">Algemene DJ Service in {city}</a>
	                        ) : (
	                            <a href={`/bruiloft-dj-${data.slug}`} className="text-primary-500 hover:text-primary-700 underline">Bruiloft DJ Service in {city}</a>
	                        )}
	                    </div>
	                </div>
	            </section>

	            {/* 6. Contact Form Section */}
	            <section className="py-16 bg-white">
	                <div className="container mx-auto px-4 max-w-3xl">
	                    <ContactForm
	                        variant={variant}
	                        eventType={data.slug.startsWith('bruiloft-dj-') ? 'bruiloft' : ''}
	                    />
	                </div>
	            </section>

	            {/* 7. Footer CTA - Localized */}
	            <div className="bg-[#1A2C4B] text-white py-12 text-center">
	                <h3 className="text-4xl font-bold mb-4">
	                    {/* T12: A/B Test - Variant B uses a different CTA text */}
	                    {variant === 'B' ?
	                        `Vraag vandaag nog een gratis offerte aan in ${city}!` :
	                        `Klaar voor een onvergetelijk feest in ${city} of ${province}?`
	                    }
	                </h3>
	                <p className="text-white mb-4">
	                    Bel ons direct op <a href="tel:+31408422594" className="font-bold underline hover:text-secondary">+31 (0) 40 8422594</a>
	                </p>
	            </div>

            {/* 8. Footer */}
            <Footer />
        </div>
    );
};

export default LocalSeoPage;
