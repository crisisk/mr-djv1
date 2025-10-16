import React from 'react';
import Button from '../Atoms/Buttons.jsx';
import { trackEvent } from '../../lib/analytics.js';

const packages = [
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

const PricingCard = ({ pkg }) => {
  const { name, subtitle, price, duration, category, features, upsells, isFeatured, buttonText } = pkg;

  const cardClasses = isFeatured
    ? 'bg-neutral-dark text-neutral-light shadow-2xl transform scale-105'
    : 'bg-neutral-light text-neutral-dark shadow-lg';

  const headerClasses = isFeatured
    ? 'text-secondary border-b border-secondary/50'
    : 'text-primary border-b border-neutral-gray-100';

  const buttonVariant = isFeatured ? 'secondary' : 'primary';

  const handleClick = () => {
    trackEvent('package_cta_click', {
      package_name: name,
      placement: 'design_system_pricing_tables',
    });
  };

  const handleHover = () => {
    trackEvent('package_view', {
      package_name: name,
      placement: 'design_system_pricing_tables',
    });
  };

  return (
    <div className={`relative flex flex-col p-spacing-xl rounded-lg transition duration-300 ${cardClasses}`}>
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-secondary text-neutral-dark text-font-size-small font-bold px-spacing-md py-spacing-xs rounded-tr-lg rounded-bl-lg">
          Populair
        </div>
      )}
      <div className={`pb-spacing-md mb-spacing-md ${headerClasses}`}>
        <h3 className="text-font-size-h3 font-bold">{name}</h3>
        <p className="text-font-size-small opacity-80">{subtitle}</p>
      </div>
      <div className="flex flex-col mb-spacing-lg">
        <span className="text-font-size-h1 font-extrabold">{price}</span>
        {duration && <span className="text-font-size-small opacity-70">{duration}</span>}
        {category && (
          <span className="text-font-size-small opacity-80">
            Geschikt voor: {Array.isArray(category) ? category.join(', ') : category}
          </span>
        )}
      </div>
      <ul className="flex-grow space-y-spacing-sm mb-spacing-xl">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-font-size-body">
            <svg
              className={`w-5 h-5 mr-spacing-sm ${isFeatured ? 'text-secondary' : 'text-primary'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      {upsells && upsells.length > 0 && (
        <div className="mb-spacing-lg rounded-lg border border-primary/20 bg-primary/5 p-spacing-md">
          <p className="text-font-size-small font-semibold uppercase tracking-wide text-primary mb-spacing-xs">
            Populaire uitbreidingen
          </p>
          <ul className="space-y-spacing-xs text-font-size-small">
            {upsells.map((addon) => (
              <li key={addon.id} className="flex items-center justify-between">
                <span>{addon.label}</span>
                <span className="font-semibold">{addon.price}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      <Button
        variant={buttonVariant}
        size="lg"
        className="w-full"
        onClick={handleClick}
        onMouseEnter={handleHover}
      >
        {buttonText}
      </Button>
    </div>
  );
};

const PricingTables = () => {
  return (
    <section className="py-spacing-3xl bg-neutral-gray-100">
      <div className="container mx-auto px-spacing-md">
        <h2 className="text-font-size-h2 text-center text-neutral-dark mb-spacing-2xl font-extrabold">
          Onze Pakketten
        </h2>
        <p className="text-center text-font-size-body text-neutral-gray-600 max-w-2xl mx-auto mb-spacing-2xl">
          Combineer basispakketten met uitbreidingen zoals sparkulars, branding en live-musici. De data-layer events volgen elke
          klik zodat marketingteams kunnen optimaliseren.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-xl items-start">
          {packages.map((pkg) => (
            <PricingCard key={pkg.name} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTables;
