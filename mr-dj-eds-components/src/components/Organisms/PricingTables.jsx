import React from 'react';
import Button from '../Atoms/Buttons.jsx';
import { loadTrackConversion } from '../../utils/loadTrackConversion';

// Data structure for the three packages
const packages = [
  {
    name: "Brons",
    subtitle: "Entry-level pakket",
    price: "€495",
    features: [
      "4 uur DJ-set",
      "Basis licht- en geluidsset",
      "Persoonlijk intakegesprek",
      "Muziekvoorkeuren formulier",
    ],
    isFeatured: false,
    buttonText: "Meer Info",
  },
  {
    name: "Zilver",
    subtitle: "Meest gekozen",
    price: "€795",
    features: [
      "6 uur DJ-set",
      "Uitgebreide lichtshow",
      "DJ + Saxofonist optie",
      "100% dansgarantie",
      "Onbeperkt aantal gasten",
    ],
    isFeatured: true,
    buttonText: "Boek Nu",
  },
  {
    name: "Goud",
    subtitle: "Premium All-Inclusive",
    price: "€1.295",
    features: [
      "8 uur DJ-set",
      "Luxe licht- en geluidsset",
      "DJ + Saxofonist (inbegrepen)",
      "Ceremonie & receptie muziek",
      "Professionele apparatuur",
    ],
    isFeatured: false,
    buttonText: "Vraag Offerte Aan",
  },
];

const PricingCard = ({ pkg }) => {
  const { name, subtitle, price, features, isFeatured, buttonText } = pkg;

  // Use token-based classes
  const cardClasses = isFeatured
    ? "bg-[#1A2C4B] text-white shadow-2xl transform scale-105"
    : "bg-white text-[#1A2C4B] shadow-lg";

  const headerClasses = isFeatured
    ? "text-secondary border-b border-secondary/50"
    : "text-primary border-b border-gray-100";

  const buttonVariant = isFeatured ? "secondary" : "primary";

  // Handle CTA click with tracking
  const handleCTAClick = () => {
    loadTrackConversion()
      .then(({ getUserVariant, trackPricingCTA }) => {
        if (typeof trackPricingCTA === 'function') {
          const variant = typeof getUserVariant === 'function' ? getUserVariant() : undefined;
          trackPricingCTA(variant, name, price);
        }
      })
      .catch((error) => {
        console.error('Failed to load tracking utilities for pricing CTA', error);
      });
  };

  return (
    <div className={`relative flex flex-col p-8 rounded-lg transition duration-300 ${cardClasses}`}>
      {isFeatured && (
        <div className="absolute top-0 right-0 bg-secondary text-[#1A2C4B] text-sm font-bold px-4 py-1 rounded-tr-lg rounded-bl-lg">
          Populair
        </div>
      )}
      <div className={`pb-4 mb-4 ${headerClasses}`}>
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="text-sm opacity-80">{subtitle}</p>
      </div>
      <div className="flex items-baseline mb-6">
        <span className="text-5xl font-extrabold">{price}</span>
        <span className="text-base ml-1">/ event</span>
      </div>
      <ul className="flex-grow space-y-2 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-base">
            <svg className={`w-5 h-5 mr-2 ${isFeatured ? 'text-secondary' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            {feature}
          </li>
        ))}
      </ul>
      <Button
        variant={buttonVariant}
        size="lg"
        className="w-full"
        onClick={handleCTAClick}
      >
        {buttonText}
      </Button>
    </div>
  );
};

const PricingTables = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-center text-[#1A2C4B] mb-12 font-extrabold">
          Onze Pakketten
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {packages.map((pkg, index) => (
            <PricingCard key={index} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTables;
