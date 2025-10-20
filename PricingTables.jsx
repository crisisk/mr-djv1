import React from 'react';
import Button from './Buttons.jsx';
import usePricingToggle from './usePricingToggle';

const BILLING_MODES = {
  EVENT: 'event',
  MONTHLY: 'monthly',
};

// Data structure for the three packages with pricing variations
const packages = [
  {
    name: 'Brons',
    subtitle: 'Entry-level pakket',
    pricing: {
      [BILLING_MODES.EVENT]: {
        amount: '€495',
        suffix: '/ event',
        description: 'Eenmalige betaling per event.',
      },
      [BILLING_MODES.MONTHLY]: {
        amount: '€99',
        suffix: '/ maand',
        description: 'Flexibel maandelijks plan voor terugkerende events.',
      },
    },
    features: [
      '4 uur DJ-set',
      'Basis licht- en geluidsset',
      'Persoonlijk intakegesprek',
      'Muziekvoorkeuren formulier',
    ],
    isFeatured: false,
    buttonText: 'Meer Info',
  },
  {
    name: 'Zilver',
    subtitle: 'Meest gekozen',
    pricing: {
      [BILLING_MODES.EVENT]: {
        amount: '€795',
        suffix: '/ event',
        description: 'Populairste keuze voor bruiloften en bedrijfsevents.',
      },
      [BILLING_MODES.MONTHLY]: {
        amount: '€149',
        suffix: '/ maand',
        description: 'Vaste maandprijs inclusief 2 events per kwartaal.',
      },
    },
    features: [
      '6 uur DJ-set',
      'Uitgebreide lichtshow',
      'DJ + Saxofonist optie',
      '100% dansgarantie',
      'Onbeperkt aantal gasten',
    ],
    isFeatured: true,
    buttonText: 'Boek Nu',
  },
  {
    name: 'Goud',
    subtitle: 'Premium All-Inclusive',
    pricing: {
      [BILLING_MODES.EVENT]: {
        amount: '€1.295',
        suffix: '/ event',
        description: 'All-in pakket voor luxe en grootschalige events.',
      },
      [BILLING_MODES.MONTHLY]: {
        amount: '€199',
        suffix: '/ maand',
        description: 'Premium abonnement met planning- & aftermovie-services.',
      },
    },
    features: [
      '8 uur DJ-set',
      'Luxe licht- en geluidsset',
      'DJ + Saxofonist (inbegrepen)',
      'Ceremonie & receptie muziek',
      'Professionele apparatuur',
    ],
    isFeatured: false,
    buttonText: 'Vraag Offerte Aan',
  },
];

const PricingCard = ({ pkg, billingMode }) => {
  const { name, subtitle, pricing, features, isFeatured, buttonText } = pkg;
  const pricingDetails = pricing[billingMode];

  // Use token-based classes
  const cardClasses = isFeatured
    ? "bg-neutral-dark text-neutral-light shadow-2xl transform scale-105"
    : "bg-neutral-light text-neutral-dark shadow-lg";

  const headerClasses = isFeatured
    ? "text-secondary border-b border-secondary/50"
    : "text-primary border-b border-neutral-gray-100";

  const buttonVariant = isFeatured ? "secondary" : "primary";

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
      <div className="flex flex-col gap-spacing-xs mb-spacing-lg">
        <div className="flex items-baseline">
          <span className="text-font-size-h1 font-extrabold">{pricingDetails.amount}</span>
          <span className="text-font-size-body ml-spacing-xs">{pricingDetails.suffix}</span>
        </div>
        <p className="text-font-size-small opacity-80">{pricingDetails.description}</p>
      </div>
      <ul className="flex-grow space-y-spacing-sm mb-spacing-xl">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-font-size-body">
            <svg className={`w-5 h-5 mr-spacing-sm ${isFeatured ? 'text-secondary' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Button variant={buttonVariant} size="lg" className="w-full">
        {buttonText}
      </Button>
    </div>
  );
};

const PricingTables = () => {
  const {
    billingMode,
    isMonthly,
    isEvent,
    selectMonthly,
    selectEvent,
  } = usePricingToggle(BILLING_MODES.EVENT);

  return (
    <section className="py-spacing-3xl bg-neutral-gray-100">
      <div className="container mx-auto px-spacing-md">
        <h2 className="text-font-size-h2 text-center text-neutral-dark mb-spacing-2xl font-extrabold">
          Onze Pakketten
        </h2>
        <div className="flex flex-col items-center mb-spacing-2xl" role="group" aria-label="Kies facturering">
          <div className="inline-flex rounded-full bg-neutral-light p-spacing-xs shadow">
            <button
              type="button"
              onClick={selectEvent}
              aria-pressed={isEvent}
              className={`px-spacing-lg py-spacing-sm rounded-full text-font-size-body transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                isEvent
                  ? 'bg-primary text-neutral-light'
                  : 'bg-transparent text-neutral-dark hover:bg-neutral-gray-200'
              }`}
            >
              Per event
            </button>
            <button
              type="button"
              onClick={selectMonthly}
              aria-pressed={isMonthly}
              className={`px-spacing-lg py-spacing-sm rounded-full text-font-size-body transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${
                isMonthly
                  ? 'bg-primary text-neutral-light'
                  : 'bg-transparent text-neutral-dark hover:bg-neutral-gray-200'
              }`}
            >
              Per maand
            </button>
          </div>
          <p className="mt-spacing-sm text-center text-font-size-small text-neutral-gray-500">
            Vergelijk onze pakketten per event of kies voor een flexibel abonnement.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-xl items-center">
          {packages.map((pkg, index) => (
            <PricingCard key={`${pkg.name}-${index}`} pkg={pkg} billingMode={billingMode} />
          ))}
        </div>
        <CallToAction
          className="mt-spacing-2xl"
          eyebrow="Flexibele opties"
          title="Niet zeker welk pakket past?"
          description="Plan een vrijblijvend adviesgesprek en we helpen u binnen enkele minuten het ideale pakket samen te stellen."
          align="center"
          primaryButton={{
            label: 'Vraag Offerte Aan',
            variant: 'secondary',
            'data-conversion_type': 'pricing_cta',
          }}
          secondaryButton={{
            as: 'a',
            href: 'tel:+31851234567',
            label: 'Bel Direct',
            variant: 'outline',
            'aria-label': 'Bel ons direct op +31 85 123 4567',
          }}
        />
      </div>
    </section>
  );
};

export default PricingTables;
