import React from 'react';
import Button from './Buttons.jsx';
import usePricingToggle from './usePricingToggle';
import { BILLING_MODES, pricingPackages } from './src/data/pricing_packages.js';

const PricingCard = ({ pkg, billingMode, localHighlight, activeCitySlug }) => {
  const { name, subtitle, pricing, features, isFeatured, buttonText, localHighlights } = pkg;
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
    <div
      className={`relative flex flex-col p-spacing-xl rounded-lg transition duration-300 ${cardClasses}`}
      data-active-city={activeCitySlug || undefined}
    >
      {isFeatured && (
        <div
          className="absolute top-0 right-0 rounded-tr-lg rounded-bl-lg bg-secondary px-spacing-md py-spacing-xs text-font-size-small font-bold text-neutral-dark"
          role="status"
          aria-label="Populair pakket"
        >
          Populair
        </div>
      )}
      <div className={`mb-spacing-lg pb-spacing-md md:mb-spacing-xl ${headerClasses}`}>
        <h3 className="text-font-size-h3 font-bold">{name}</h3>
        <p className="text-font-size-small opacity-80">{subtitle}</p>
      </div>
      <div className="mb-spacing-xl flex flex-col gap-spacing-sm">
        <div className="flex items-baseline">
          <span className="text-font-size-h1 font-extrabold">{pricingDetails.amount}</span>
          <span className="text-font-size-body ml-spacing-xs">{pricingDetails.suffix}</span>
        </div>
        <p className="text-font-size-small opacity-80">{pricingDetails.description}</p>
        {localHighlight && (
          <div
            className="mt-spacing-xs rounded-md border border-secondary/30 bg-secondary/10 p-spacing-sm space-y-1"
            data-testid={`pricing-local-highlight-${pkg.id}`}
          >
            {localHighlights?.label && (
              <p className="text-font-size-small font-semibold uppercase tracking-wide text-secondary">
                {localHighlights.label}
              </p>
            )}
            <p className="text-font-size-small text-secondary leading-relaxed">{localHighlight}</p>
          </div>
        )}
      </div>
      <ul className="mb-spacing-xl flex-grow space-y-spacing-sm md:space-y-spacing-md">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start text-font-size-body">
            <svg
              className={`mr-spacing-sm h-5 w-5 ${isFeatured ? 'text-secondary' : 'text-primary'}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
            >
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

const PricingTables = ({ citySlug, localSeo }) => {
  const {
    billingMode,
    isMonthly,
    isEvent,
    selectMonthly,
    selectEvent,
  } = usePricingToggle(BILLING_MODES.EVENT);

  const resolvedLocalSeo = React.useMemo(() => {
    if (localSeo) {
      if (localSeo.pricingHighlights) {
        return localSeo;
      }

      if (localSeo.slug) {
        const datasetEntry = getLocalSeoDataBySlug(localSeo.slug);
        return datasetEntry ? { ...datasetEntry, ...localSeo } : localSeo;
      }

      return localSeo;
    }

    if (citySlug) {
      return getLocalSeoDataBySlug(citySlug);
    }

    return null;
  }, [citySlug, localSeo]);

  const highlightMap = resolvedLocalSeo?.pricingHighlights;
  const activeCitySlug = resolvedLocalSeo?.slug;

  return (
    <section className="bg-neutral-gray-100 py-spacing-3xl lg:py-spacing-4xl xl:py-spacing-5xl">
      <div className="container mx-auto px-spacing-md sm:px-spacing-lg lg:px-spacing-xl xl:px-spacing-2xl">
        <h2 className="mb-spacing-2xl text-center text-font-size-h2 font-extrabold text-neutral-dark md:mb-spacing-3xl">
          Onze Pakketten
        </h2>
        <div className="mb-spacing-2xl flex flex-col items-center md:mb-spacing-3xl" role="group" aria-label="Kies facturering">
          <div className="inline-flex rounded-full bg-neutral-light p-spacing-xs shadow md:p-spacing-sm">
            <button
              type="button"
              onClick={selectEvent}
              aria-pressed={isEvent}
              className={`rounded-full px-spacing-md py-spacing-sm text-font-size-body transition-colors duration-300 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-light sm:px-spacing-lg md:py-spacing-md ${
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
              className={`rounded-full px-spacing-md py-spacing-sm text-font-size-body transition-colors duration-300 focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/70 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-light sm:px-spacing-lg md:py-spacing-md ${
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
          {pricingPackages.map((pkg, index) => (
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
