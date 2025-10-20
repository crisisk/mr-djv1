import React from 'react';
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
  return (
    <div className={`${backgroundClass} py-spacing-3xl px-spacing-xl min-h-[60vh] flex items-center`}>
      <div className="container mx-auto text-center">
        <h1 className={`text-font-size-h1 font-extrabold ${titleColor} mb-spacing-md`}>
          {title}
        </h1>
        <p className={`text-font-size-h3 mb-spacing-xl max-w-4xl mx-auto ${subtitleColor}`}>
          {subtitle}
        </p>
        <div className="flex justify-center space-x-spacing-md">
          <Button variant="secondary" size="lg">
            {ctaPrimaryText}
          </Button>
          {ctaSecondaryText && (
            <Button variant="outline" size="lg">
              {ctaSecondaryText}
            </Button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
};

export default HeroSection;
