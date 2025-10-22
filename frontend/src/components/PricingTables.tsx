"use client";

import { Button } from './Button';

export interface PricingFeatureSet {
  name: string;
  subtitle: string;
  price: string;
  features: string[];
  isFeatured?: boolean;
  buttonText: string;
}

export interface PricingTablesProps {
  packages?: PricingFeatureSet[];
}

const euroFormatter = new Intl.NumberFormat('nl-NL', {
  style: 'currency',
  currency: 'EUR'
});

const defaultPackages: PricingFeatureSet[] = [
  {
    name: 'Brons',
    subtitle: 'Entry-level pakket',
    price: euroFormatter.format(495),
    features: ['4 uur DJ-set', 'Basis licht- en geluidsset', 'Persoonlijk intakegesprek', 'Muziekvoorkeuren formulier'],
    buttonText: 'Meer Info',
  },
  {
    name: 'Zilver',
    subtitle: 'Meest gekozen',
    price: euroFormatter.format(795),
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
    price: euroFormatter.format(1295),
    features: [
      '8 uur DJ-set',
      'Luxe licht- en geluidsset',
      'DJ + Saxofonist (inbegrepen)',
      'Ceremonie & receptie muziek',
      'Professionele apparatuur',
    ],
    buttonText: 'Vraag Offerte Aan',
  },
];

function PricingCard({ pkg }: { pkg: PricingFeatureSet }) {
  const { name, subtitle, price, features, isFeatured, buttonText } = pkg;

  const cardClasses = isFeatured
    ? 'bg-neutral-dark text-neutral-light shadow-2xl transform scale-105'
    : 'bg-neutral-light text-neutral-dark shadow-lg';

  const headerClasses = isFeatured
    ? 'text-secondary border-b border-secondary/50'
    : 'text-primary border-b border-neutral-gray-100';

  const buttonVariant = isFeatured ? 'secondary' : 'primary';

  return (
    <div className={`relative flex flex-col p-spacing-xl rounded-lg transition duration-300 ${cardClasses}`}>
      {isFeatured ? (
        <div className="absolute top-0 right-0 bg-secondary text-neutral-dark body-sm text-strong px-spacing-md py-spacing-xs rounded-tr-lg rounded-bl-lg">
          Populair
        </div>
      ) : null}
      <div className={`pb-spacing-md mb-spacing-md ${headerClasses}`}>
        <h3 className="heading-3">{name}</h3>
        <p className="body-sm opacity-80">{subtitle}</p>
      </div>
      <div className="flex items-baseline mb-spacing-lg">
        <span className="heading-1">{price}</span>
        <span className="body-md ml-spacing-xs">/ event</span>
      </div>
      <ul className="flex-grow space-y-spacing-sm mb-spacing-xl">
        {features.map((feature) => (
          <li key={feature} className="flex items-start body-md">
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
      <Button variant={buttonVariant} size="lg" className="w-full">
        {buttonText}
      </Button>
    </div>
  );
}

export function PricingTables({ packages = defaultPackages }: PricingTablesProps) {
  return (
    <section className="py-spacing-3xl bg-neutral-gray-100">
      <div className="container mx-auto px-spacing-md">
        <h2 className="heading-2 text-center text-neutral-dark mb-spacing-2xl">Onze Pakketten</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-spacing-xl items-center">
          {packages.map((pkg) => (
            <PricingCard key={pkg.name} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PricingTables;
export { defaultPackages as defaultPricingPackages };
