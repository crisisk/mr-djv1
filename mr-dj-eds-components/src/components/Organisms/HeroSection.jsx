import React from 'react';
import { Button } from '../ui/button.jsx';

const HeroSection = ({
  eyebrow,
  title,
  subtitle,
  ctaPrimaryText,
  ctaSecondaryText,
  ctaPrimaryHref,
  ctaSecondaryHref,
  onPrimaryClick,
  onSecondaryClick,
  backgroundClass = 'bg-neutral-dark',
  titleColor = 'text-secondary',
  subtitleColor = 'text-neutral-light',
  badges = [],
  socialProof,
  metrics = [],
  children,
}) => {
  const renderButton = (text, href, onClick, variant = 'secondary') => {
    if (!text) return null;

    const button = (
      <Button variant={variant} size="lg" onClick={onClick}>
        {text}
      </Button>
    );

    if (href) {
      return (
        <a href={href} className="inline-flex" onClick={onClick}>
          {button}
        </a>
      );
    }

    return button;
  };

  return (
    <div className={`${backgroundClass} py-spacing-3xl px-spacing-xl min-h-[60vh] flex items-center`}>
      <div className="container mx-auto text-center space-y-spacing-lg">
        {eyebrow && (
          <p className="text-sm uppercase tracking-[0.3em] text-secondary/80">{eyebrow}</p>
        )}
        <h1 className={`text-font-size-h1 font-extrabold ${titleColor}`}>
          {title}
        </h1>
        <p className={`text-font-size-h3 max-w-4xl mx-auto ${subtitleColor}`}>
          {subtitle}
        </p>
        {badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-spacing-sm">
            {badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full bg-neutral-light/10 px-spacing-md py-spacing-xs text-sm font-semibold text-neutral-light"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-spacing-md">
          {renderButton(ctaPrimaryText, ctaPrimaryHref, onPrimaryClick, 'secondary')}
          {ctaSecondaryText &&
            renderButton(ctaSecondaryText, ctaSecondaryHref, onSecondaryClick, 'outline')}
        </div>
        {socialProof && (
          <p className="text-sm text-neutral-light/80 max-w-3xl mx-auto">
            {socialProof}
          </p>
        )}
        {metrics.length > 0 && (
          <dl className="grid gap-spacing-lg md:grid-cols-3 text-left text-neutral-light/90">
            {metrics.map((metric) => (
              <div key={`${metric.label}-${metric.value}`} className="text-center md:text-left">
                <dt className="text-xs uppercase tracking-wide text-neutral-light/60">
                  {metric.label}
                </dt>
                <dd className="text-font-size-h2 font-bold">{metric.value}</dd>
              </div>
            ))}
          </dl>
        )}
        {children}
      </div>
    </div>
  );
};

export default HeroSection;
