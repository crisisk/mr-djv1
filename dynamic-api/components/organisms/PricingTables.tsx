'use client';

import React from 'react';
import Button from '../ui/Button';
import { trackEvent } from '../../lib/analytics'; // Assuming this utility exists

// --- Interfaces ---

interface Upsell {
  id: string;
  label: string;
  price: string;
}

interface Package {
  name: string;
  subtitle: string;
  price: string;
  duration: string;
  category: string[];
  features: string[];
  upsells: Upsell[];
  isFeatured: boolean;
  buttonText: string;
  badge?: string;
}

interface PricingCardProps {
  pkg: Package;
  segmentId?: string;
  onSelect?: (pkg: Package) => void;
}

// --- Data ---

const packages: Package[] = [
  {
    name: 'Brons',
    subtitle: 'Entry-level pakket',
    price: '€495',
    duration: '4 uur showtijd',
    category: ['Private', 'Bedrijfsfeest'],
    features: [
      '4 uur DJ-set',
      'Basis licht- en geluidsset',
      'Persoonlijk intakegesprek',
      'Muziekvoorkeuren formulier',
    ],
    upsells: [
      { id: 'rookmachine', label: 'Rookmachine & sfeerlicht', price: '€75' },
      { id: 'ceremonie', label: 'Ceremonie audio set', price: '€195' },
    ],
    isFeatured: false,
    buttonText: 'Meer Info',
  },
  {
    name: 'Zilver',
    subtitle: 'Meest gekozen',
    price: '€795',
    duration: '5 uur showtijd',
    category: ['Bruiloft'],
    features: [
      '6 uur DJ-set',
      'Uitgebreide lichtshow',
      'DJ + Saxofonist optie',
      '100% dansgarantie',
      'Onbeperkt aantal gasten',
    ],
    upsells: [
      { id: 'sparkular', label: 'Sparkular show', price: '€245' },
      { id: 'sax', label: 'Live saxofonist', price: '€325' },
      { id: 'photobooth', label: '360° photobooth', price: '€425' },
    ],
    isFeatured: true,
    buttonText: 'Boek Nu',
  },
  {
    name: 'Goud',
    subtitle: 'Premium All-Inclusive',
    price: '€1.295',
    duration: '6 uur showtijd + productie',
    category: ['Bruiloft', 'Bedrijfsfeest'],
    features: [
      '8 uur DJ-set',
      'Luxe licht- en geluidsset',
      'DJ + Saxofonist (inbegrepen)',
      'Ceremonie & receptie muziek',
      'Professionele apparatuur',
    ],
    upsells: [
      { id: 'branding', label: 'Custom booth branding', price: '€395' },
      { id: 'host', label: 'Host & vocalist', price: '€295' },
      { id: 'afterfilm', label: 'Aftermovie & content', price: '€495' },
    ],
    isFeatured: false,
    buttonText: 'Vraag Offerte Aan',
  },
];

// --- Components ---

const PricingCard: React.FC<PricingCardProps> = ({ pkg, segmentId, onSelect }) => {
  const { name, subtitle, price, duration, category, features, upsells, isFeatured, buttonText, badge } = pkg;

  const cardClasses = isFeatured
    ? 'bg-primary text-white shadow-2xl transform scale-105 ring-4 ring-secondary/50'
    : 'bg-white text-neutral-dark shadow-lg ring-1 ring-neutral-gray-100';

  const headerClasses = isFeatured
    ? 'text-secondary border-b border-secondary/50'
    : 'text-primary border-b border-neutral-gray-100';

  const buttonVariant = isFeatured ? 'secondary' : 'primary';

  const handleClick = () => {
    if (typeof trackEvent === 'function') {
      trackEvent('package_cta_click', {
        package_name: name,
        placement: 'design_system_pricing_tables',
        personalization_variant: segmentId || 'default',
      });
    }
    onSelect?.(pkg);
  };

  const handleHover = () => {
    if (typeof trackEvent === 'function') {
      trackEvent('package_view', {
        package_name: name,
        placement: 'design_system_pricing_tables',
        personalization_variant: segmentId || 'default',
      });
    }
  };

  return (
    <div
      className={`relative flex flex-col p-spacing-xl rounded-lg transition duration-300 h-full ${cardClasses}`}
      onMouseEnter={handleHover}
      aria-label={`Pakket: ${name}`}
    >
      {isFeatured && (
        <div className="absolute top-0 right-0 -mt-4 -mr-4 px-spacing-md py-spacing-xs bg-secondary text-white font-bold rounded-full shadow-md uppercase text-sm tracking-wider">
          Meest Populair
        </div>
      )}

      <header className={`pb-spacing-lg mb-spacing-lg ${headerClasses}`}>
        <h3 className="text-2xl font-bold mb-spacing-xs">{name}</h3>
        <p className="text-sm opacity-80">{subtitle}</p>
        <p className="text-5xl font-extrabold mt-spacing-md">{price}</p>
        <p className="text-sm opacity-70 mt-spacing-xs">{duration}</p>
      </header>

      <div className="flex-grow">
        <ul className="space-y-spacing-sm mb-spacing-lg">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start text-sm">
              <svg
                className={`w-5 h-5 mr-spacing-sm flex-shrink-0 ${isFeatured ? 'text-secondary' : 'text-primary'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {feature}
            </li>
          ))}
        </ul>

        <div className="mt-spacing-lg pt-spacing-lg border-t border-dashed border-current/30">
          <h4 className="font-semibold mb-spacing-sm text-sm uppercase opacity-80">Optionele Upgrades</h4>
          <ul className="space-y-spacing-xs text-sm opacity-90">
            {upsells.map((upsell) => (
              <li key={upsell.id} className="flex justify-between">
                <span>{upsell.label}</span>
                <span className="font-medium">{upsell.price}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-spacing-xl pt-spacing-lg">
        <Button
          variant={buttonVariant}
          size="lg"
          className="w-full"
          onClick={handleClick}
          aria-label={`Selecteer pakket ${name}`}
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};

const PricingTables: React.FC = () => {
  const segmentId = 'pricing_page_v1'; // Example segment ID

  return (
    <section className="py-spacing-xl bg-neutral-gray-50" aria-labelledby="pricing-heading">
      <div className="max-w-7xl mx-auto px-spacing-lg">
        <h2 id="pricing-heading" className="text-4xl font-extrabold text-center text-neutral-dark mb-spacing-xl">
          Onze Pakketten
        </h2>
        <p className="text-center text-lg text-neutral-dark/80 mb-spacing-xl max-w-3xl mx-auto">
          Kies het pakket dat perfect aansluit bij uw evenement. Elk pakket is volledig aanpasbaar met onze optionele upgrades.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-lg items-stretch">
          {packages.map((pkg) => (
            <PricingCard
              key={pkg.name}
              pkg={pkg}
              segmentId={segmentId}
              onSelect={(selectedPkg) => console.log('Package selected:', selectedPkg.name)}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTables;