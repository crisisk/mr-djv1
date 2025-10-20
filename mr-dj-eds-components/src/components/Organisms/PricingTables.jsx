import React from 'react';
import Button from '../Atoms/Buttons.jsx';
import { BILLING_MODES, pricingPackages } from '../../data/pricingPackages.js';
import { trackPricingCTA, getUserVariant } from '../../utils/trackConversion';

const PricingCard = ({ pkg, billingMode, isHighlighted }) => {
  const { name, subtitle, features, buttonText } = pkg;
  const pricingDetails =
    pkg.pricing[billingMode] ?? pkg.pricing[BILLING_MODES.EVENT];

  // Use token-based classes
  const cardClasses = isHighlighted
    ? "bg-[#1A2C4B] text-white shadow-2xl transform scale-105"
    : "bg-white text-[#1A2C4B] shadow-lg";

  const headerClasses = isHighlighted
    ? "text-secondary border-b border-secondary/50"
    : "text-primary border-b border-gray-100";

  const buttonVariant = isHighlighted ? "secondary" : "primary";

  // Handle CTA click with tracking
  const handleCTAClick = () => {
    const variant = getUserVariant();
    trackPricingCTA(variant, name, pricingDetails.displayAmount);
  };

  return (
    <div className={`relative flex flex-col p-8 rounded-lg transition duration-300 ${cardClasses}`}>
      {isHighlighted && (
        <div className="absolute top-0 right-0 bg-secondary text-[#1A2C4B] text-sm font-bold px-4 py-1 rounded-tr-lg rounded-bl-lg">
          Populair
        </div>
      )}
      <div className={`pb-4 mb-4 ${headerClasses}`}>
        <h3 className="text-2xl font-bold">{name}</h3>
        <p className="text-sm opacity-80">{subtitle}</p>
      </div>
      <div className="flex flex-col gap-2 mb-6">
        <div className="flex items-baseline">
          <span className="text-5xl font-extrabold">{pricingDetails.displayAmount}</span>
          <span className="text-base ml-1">{pricingDetails.suffix}</span>
        </div>
        <p className="text-sm opacity-80">{pricingDetails.description}</p>
      </div>
      <ul className="flex-grow space-y-2 mb-8">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-base">
            <svg className={`w-5 h-5 mr-2 ${isHighlighted ? 'text-secondary' : 'text-primary'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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

const PricingTables = ({
  highlightPackage,
  billingMode = BILLING_MODES.EVENT,
  packages = pricingPackages,
}) => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl text-center text-[#1A2C4B] mb-12 font-extrabold">
          Onze Pakketten
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {packages.map((pkg) => {
            const isHighlighted = highlightPackage
              ? pkg.name.toLowerCase() === highlightPackage.toLowerCase()
              : pkg.isFeatured;

            return (
              <PricingCard
                key={pkg.id || pkg.name}
                pkg={pkg}
                billingMode={billingMode}
                isHighlighted={isHighlighted}
              />
            );
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTables;
