'use client';

import React from 'react';
import { motion } from 'framer-motion';
import VideoHeroSection from '../sections/VideoHero';
import Ratings from '../ui/Ratings';
import MediaGallery from '../patterns/MediaGallery';
import AvailabilityChecker from '../patterns/AvailabilityChecker';
import Accordion from '../ui/Accordion';
import { MapPin, Phone, Mail } from 'lucide-react';

interface LocalSEOPageProps {
  city: {
    name: string;
    region: string;
    coordinates?: { lat: number; lng: number };
    postalCodes?: string[];
    neighborhoods?: string[];
  };
  testimonials?: Array<{
    id: string;
    name: string;
    location: string;
    text: string;
    rating: number;
  }>;
  galleryImages?: Array<{
    id: string;
    src: string;
    alt: string;
    label?: string;
  }>;
  className?: string;
}

export default function LocalSEOPage({
  city,
  testimonials = [],
  galleryImages = [],
  className = '',
}: LocalSEOPageProps) {
  const faqItems = [
    {
      value: 'q1',
      title: `Wat zijn jullie tarieven in ${city.name}?`,
      content: `Onze DJ pakketten in ${city.name} beginnen vanaf €800 voor een basic pakket. Dit is inclusief professionele apparatuur, lichtshow en 4 uur entertainment. Voor een compleet overzicht van onze prijzen en pakketten, vraag een gratis offerte aan.`,
    },
    {
      value: 'q2',
      title: `Hoe ver van tevoren moet ik boeken voor een feest in ${city.name}?`,
      content: `We raden aan om minimaal 3-6 maanden van tevoren te boeken, vooral voor populaire data zoals weekenden in het hoogseizoen. Voor last-minute boekingen in ${city.name} kun je altijd contact met ons opnemen om de beschikbaarheid te checken.`,
    },
    {
      value: 'q3',
      title: `Bedienen jullie ook omliggende plaatsen van ${city.name}?`,
      content: `Ja, we bedienen ${city.name} en heel ${city.region}. ${city.neighborhoods && city.neighborhoods.length > 0 ? `Dit omvat ook ${city.neighborhoods.join(', ')} en omliggende gebieden.` : 'We komen graag naar alle locaties in de regio.'}`,
    },
    {
      value: 'q4',
      title: 'Wat is inbegrepen in jullie DJ service?',
      content: `Elk pakket omvat professionele DJ apparatuur, lichtshow, draadloze microfoon, muziekvoorbereiding, en natuurlijk een ervaren DJ. Bij premium pakketten zijn ook live saxofonist, photo booth en extra verlichting inbegrepen.`,
    },
  ];

  const serviceAreas = city.neighborhoods || [
    `${city.name} Centrum`,
    `${city.name} Noord`,
    `${city.name} Zuid`,
    'Omliggende gemeentes',
  ];

  return (
    <div className={className}>
      {/* Structured Data for LocalBusiness */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: `Mister DJ - ${city.name}`,
            description: `Professionele DJ service voor bruiloften en feesten in ${city.name} en ${city.region}`,
            address: {
              '@type': 'PostalAddress',
              addressLocality: city.name,
              addressRegion: city.region,
              addressCountry: 'NL',
            },
            geo: city.coordinates
              ? {
                  '@type': 'GeoCoordinates',
                  latitude: city.coordinates.lat,
                  longitude: city.coordinates.lng,
                }
              : undefined,
            areaServed: {
              '@type': 'City',
              name: city.name,
            },
            telephone: '+31-40-8422594',
            priceRange: '€€',
          }),
        }}
      />

      {/* Hero Section */}
      <VideoHeroSection
        eyebrow={`Professionele DJ Service in ${city.region}`}
        title={`Bruiloft DJ ${city.name} met 100% Dansgarantie`}
        subtitle={`De beste DJ voor jouw feest in ${city.name}. 15+ jaar ervaring, 2500+ events gedraaid, en onvergetelijke avonden gegarandeerd.`}
        badges={[
          { id: '1', text: '2500+ Events' },
          { id: '2', text: '100% Dansgarantie' },
          { id: '3', text: `Expert in ${city.name}` },
          { id: '4', text: '15+ Jaar Ervaring' },
        ]}
        metrics={[
          { label: 'Events in 2024', value: '250+' },
          { label: 'Tevreden klanten', value: '98%' },
          { label: 'Gemiddelde beoordeling', value: '4.9/5' },
        ]}
        ctaPrimaryText="Gratis Offerte"
        ctaSecondaryText="Bekijk Portfolio"
      />

      {/* Ratings Section */}
      <section className="container-pro py-spacing-2xl">
        <motion.div
          className="flex flex-wrap justify-center gap-spacing-lg"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Ratings platform="google" score={4.9} reviewCount={156} />
          <Ratings platform="trustpilot" score={4.8} reviewCount={89} />
        </motion.div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-spacing-2xl">
        <div className="container-pro">
          <motion.div
            className="text-center mb-spacing-xl"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-font-size-h2 font-bold text-neutral-dark mb-spacing-sm">
              DJ Service in {city.name}
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Wij verzorgen professionele DJ services voor alle type feesten in {city.name} en
              omgeving. Van intieme bruiloften tot grote bedrijfsfeesten.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-spacing-lg">
            {['Bruiloft DJ', 'Bedrijfsfeest DJ', 'Privé Feest DJ'].map((service, index) => (
              <motion.div
                key={service}
                className="bg-white rounded-3xl p-spacing-xl shadow-md"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <h3 className="text-font-size-h3 font-bold text-neutral-dark mb-spacing-sm">
                  {service}
                </h3>
                <p className="text-gray-600 mb-spacing-md">
                  Professionele {service.toLowerCase()} service in {city.name} met jarenlange
                  ervaring en 100% dansgarantie.
                </p>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Professionele apparatuur</li>
                  <li>✓ Uitgebreide lichtshow</li>
                  <li>✓ Persoonlijke muziekvoorbereiding</li>
                  <li>✓ Backup systemen</li>
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      {galleryImages.length > 0 && (
        <section className="container-pro py-spacing-2xl">
          <h2 className="text-font-size-h2 font-bold text-neutral-dark text-center mb-spacing-xl">
            Portfolio uit {city.name}
          </h2>
          <MediaGallery items={galleryImages} layout="grid" columns={3} />
        </section>
      )}

      {/* Booking Section */}
      <section className="bg-gradient-to-br from-primary/5 to-secondary/5 py-spacing-2xl">
        <div className="container-pro">
          <div className="grid lg:grid-cols-2 gap-spacing-xl items-start">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-font-size-h2 font-bold text-neutral-dark mb-spacing-lg">
                Boek jouw DJ in {city.name}
              </h2>
              <p className="text-lg text-gray-600 mb-spacing-md">
                Vraag direct een vrijblijvende offerte aan voor jouw feest in {city.name}. We
                reageren binnen 24 uur met een persoonlijk voorstel.
              </p>

              <div className="space-y-spacing-md">
                <div className="flex items-center gap-spacing-sm text-gray-700">
                  <MapPin className="h-5 w-5 text-primary" />
                  <span>Service gebied: {serviceAreas.join(', ')}</span>
                </div>
                <div className="flex items-center gap-spacing-sm text-gray-700">
                  <Phone className="h-5 w-5 text-primary" />
                  <span>+31 40 842 2594</span>
                </div>
                <div className="flex items-center gap-spacing-sm text-gray-700">
                  <Mail className="h-5 w-5 text-primary" />
                  <span>info@mr-dj.nl</span>
                </div>
              </div>
            </motion.div>

            <AvailabilityChecker />
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container-pro py-spacing-2xl">
        <h2 className="text-font-size-h2 font-bold text-neutral-dark text-center mb-spacing-xl">
          Veelgestelde Vragen over DJ {city.name}
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion items={faqItems} defaultValue="q1" />
        </div>
      </section>
    </div>
  );
}
