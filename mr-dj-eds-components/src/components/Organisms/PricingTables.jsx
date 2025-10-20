import React from 'react';
import Button from '../Atoms/Buttons.jsx';
import { trackPricingCTA, getUserVariant } from '../../utils/trackConversion';
import { colors, spacing, typography } from '../../theme/tokens.js';

const withAlpha = (hex, alpha) => {
  const normalized = hex.replace('#', '');
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

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
  const buttonVariant = isFeatured ? "secondary" : "primary";

  const cardStyle = {
    backgroundColor: isFeatured ? colors.neutral.dark : colors.neutral.light,
    color: isFeatured ? colors.neutral.light : colors.neutral.dark,
    padding: spacing.xl,
    borderRadius: '0.75rem',
    boxShadow: isFeatured
      ? '0 25px 60px rgba(26, 44, 75, 0.35)'
      : '0 15px 40px rgba(26, 44, 75, 0.18)',
    transform: isFeatured ? 'scale(1.05)' : 'scale(1)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    minHeight: '100%',
  };

  const headerStyle = {
    color: isFeatured ? colors.secondary.main : colors.primary.main,
    borderBottom: `1px solid ${isFeatured ? withAlpha(colors.secondary.main, 0.5) : colors.neutral.gray100}`,
    paddingBottom: spacing.md,
    marginBottom: spacing.md,
  };

  const titleStyle = {
    fontSize: typography.fontSize.h3,
    fontFamily: typography.fontFamily.heading,
    fontWeight: typography.fontWeight.bold,
  };

  const subtitleStyle = {
    fontSize: typography.fontSize.small,
    opacity: 0.8,
    fontFamily: typography.fontFamily.primary,
  };

  const priceContainerStyle = {
    display: 'flex',
    alignItems: 'baseline',
    marginBottom: spacing.lg,
    gap: spacing.xs,
  };

  const priceStyle = {
    fontSize: typography.fontSize.h1,
    fontWeight: typography.fontWeight.extrabold,
    fontFamily: typography.fontFamily.heading,
    lineHeight: typography.lineHeight.tight,
  };

  const priceSuffixStyle = {
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily.primary,
  };

  const featuresStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.sm,
    marginBottom: spacing.xl,
    flexGrow: 1,
  };

  const featureItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: spacing.sm,
    fontSize: typography.fontSize.body,
    fontFamily: typography.fontFamily.primary,
  };

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
    <div className="relative flex flex-col" style={cardStyle}>
      {isFeatured && (
        <div
          className="absolute top-0 right-0 rounded-tr-lg rounded-bl-lg"
          style={{
            backgroundColor: colors.secondary.main,
            color: colors.neutral.dark,
            fontSize: typography.fontSize.small,
            fontWeight: typography.fontWeight.bold,
            paddingInline: spacing.md,
            paddingBlock: spacing.xs,
          }}
        >
          Populair
        </div>
      )}
      <div style={headerStyle}>
        <h3 style={titleStyle}>{name}</h3>
        <p style={subtitleStyle}>{subtitle}</p>
      </div>
      <div style={priceContainerStyle}>
        <span style={priceStyle}>{price}</span>
        <span style={priceSuffixStyle}>/ event</span>
      </div>
      <ul style={featuresStyle}>
        {features.map((feature, index) => (
          <li key={index} style={featureItemStyle}>
            <svg
              width="20"
              height="20"
              style={{ color: isFeatured ? colors.secondary.main : colors.primary.main, flexShrink: 0 }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
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
  const sectionStyle = {
    paddingTop: spacing['3xl'],
    paddingBottom: spacing['3xl'],
    backgroundColor: colors.neutral.gray100,
  };

  const containerStyle = {
    paddingInline: spacing.md,
  };

  const headingStyle = {
    fontSize: typography.fontSize.h2,
    textAlign: 'center',
    color: colors.neutral.dark,
    marginBottom: spacing['2xl'],
    fontFamily: typography.fontFamily.heading,
    fontWeight: typography.fontWeight.extrabold,
  };

  const gridStyle = {
    gap: spacing.xl,
  };

  return (
    <section style={sectionStyle}>
      <div className="container mx-auto" style={containerStyle}>
        <h2 style={headingStyle}>Onze Pakketten</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 items-center" style={gridStyle}>
          {packages.map((pkg, index) => (
            <PricingCard key={index} pkg={pkg} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingTables;
