import React, { useId } from 'react';
import Button from './Buttons.jsx';

const HeroSection = ({
  title,
  subtitle,
  ctaPrimaryText,
  ctaSecondaryText,
  backgroundClass = 'bg-neutral-dark',
  titleColor = 'text-secondary',
  subtitleColor = 'text-neutral-light',
  children,
}) => {
  const headingId = useId();

  return (
    <section
      className={`${backgroundClass} py-spacing-3xl px-spacing-xl min-h-[60vh] flex items-center`}
      data-component="hero-section"
      data-hero-id="primary"
      aria-labelledby={headingId}
      role="region"
    >
      <div className="container mx-auto text-center" data-component="hero-container">
        <h1
          id={headingId}
          className={`text-font-size-h1 font-extrabold ${titleColor} mb-spacing-md`}
          data-component="hero-title"
        >
          {title}
        </h1>
        <p
          className={`text-font-size-h3 mb-spacing-xl max-w-4xl mx-auto ${subtitleColor}`}
          data-component="hero-subtitle"
        >
          {subtitle}
        </p>
        <div className="flex justify-center space-x-spacing-md" data-component="hero-cta-group">
          <Button variant="secondary" size="lg" data-component="hero-cta-primary">
            {ctaPrimaryText}
          </Button>
          {ctaSecondaryText && (
            <Button variant="outline" size="lg" data-component="hero-cta-secondary">
              {ctaSecondaryText}
            </Button>
          )}
        </div>
        {children}
      </div>
    </section>
  );
};

export default HeroSection;
