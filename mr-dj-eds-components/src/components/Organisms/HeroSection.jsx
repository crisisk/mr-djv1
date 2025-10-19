import React from 'react';
import Button from '../Atoms/Buttons.jsx';

const HeroSection = ({
  title,
  subtitle,
  ctaPrimaryText,
  ctaSecondaryText,
  backgroundClass = 'bg-neutral-dark',
  backgroundImage = null,
  titleColor = 'text-secondary',
  subtitleColor = 'text-neutral-light',
  variant = 'A',
  children,
}) => {
  const bgStyle = backgroundImage ? {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  } : {};

  // Handle CTA button clicks with GTM tracking
  const handlePrimaryClick = () => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'cta_click',
        cta_type: 'primary',
        cta_text: ctaPrimaryText,
        variant: variant,
        section: 'hero'
      });
    }
  };

  const handleSecondaryClick = () => {
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'cta_click',
        cta_type: 'secondary',
        cta_text: ctaSecondaryText,
        variant: variant,
        section: 'hero'
      });
    }
  };

  return (
    <div
      className={`${!backgroundImage ? backgroundClass : ''} py-spacing-3xl px-spacing-xl min-h-[60vh] flex items-center relative`}
      style={bgStyle}
    >
      <div className="container mx-auto text-center relative z-10">
        <h1 className={`text-font-size-h1 font-extrabold ${titleColor} mb-spacing-md ${backgroundImage ? 'text-white drop-shadow-lg' : ''}`}>
          {title}
        </h1>
        <p className={`text-font-size-h3 mb-spacing-xl max-w-4xl mx-auto ${subtitleColor} ${backgroundImage ? 'text-white drop-shadow-md' : ''}`}>
          {subtitle}
        </p>
        <div className="flex justify-center space-x-spacing-md">
          <Button variant="secondary" size="lg" onClick={handlePrimaryClick}>
            {ctaPrimaryText}
          </Button>
          {ctaSecondaryText && (
            <Button variant="outline" size="lg" onClick={handleSecondaryClick}>
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
