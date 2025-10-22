import React, { ReactNode, MouseEvent } from 'react';
import Button from '../ui/Button';

// Define the allowed Button variants and sizes based on requirements
type ButtonVariant = 'primary' | 'secondary' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg';

// Define the structure for a metric item
interface Metric {
  label: string;
  value: string;
}

// Define the props for the HeroSection component
interface HeroSectionProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  ctaPrimaryText?: string;
  ctaSecondaryText?: string;
  ctaPrimaryHref?: string;
  ctaSecondaryHref?: string;
  onPrimaryClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  onSecondaryClick?: (event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void;
  backgroundClass?: string;
  titleColor?: string;
  subtitleColor?: string;
  badges?: string[];
  socialProof?: string;
  metrics?: Metric[];
  children?: ReactNode;
}

const HeroSection: React.FC<HeroSectionProps> = ({
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
  // Helper function to render a button, handling both internal clicks and external links
  const renderButton = (
    text: string | undefined,
    href: string | undefined,
    onClick: ((event: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void) | undefined,
    variant: ButtonVariant,
  ) => {
    if (!text) return null;

    const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
      // Prevent default navigation if an onClick handler is provided without an href
      if (!href && onClick) {
        e.preventDefault();
      }
      onClick?.(e);
    };

    const buttonElement = (
      <Button
        variant={variant}
        size="lg" // Use 'lg' size as per original component logic
        onClick={!href ? (handleClick as (e: MouseEvent<HTMLButtonElement>) => void) : undefined}
        // If href is present, the Button is wrapped in <a>, so onClick is handled by <a>
      >
        {text}
      </Button>
    );

    if (href) {
      return (
        <a
          href={href}
          className="inline-flex"
          onClick={handleClick as (e: MouseEvent<HTMLAnchorElement>) => void}
          // Ensure the link is accessible
          role="button"
          aria-label={text}
        >
          {buttonElement}
        </a>
      );
    }

    return buttonElement;
  };

  return (
    <div className={`${backgroundClass} py-spacing-3xl px-spacing-xl min-h-[60vh] flex items-center`}>
      <div className="container mx-auto text-center space-y-spacing-lg">
        {eyebrow && (
          <p className="text-sm uppercase tracking-[0.3em] text-secondary/80" aria-label="Category">
            {eyebrow}
          </p>
        )}
        <h1 className={`text-font-size-h1 font-extrabold ${titleColor}`}>
          {title}
        </h1>
        <p className={`text-font-size-h3 max-w-4xl mx-auto ${subtitleColor}`}>
          {subtitle}
        </p>
        {badges.length > 0 && (
          <div className="flex flex-wrap justify-center gap-spacing-sm" aria-label="Features">
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
          {/* Primary CTA - using 'secondary' variant as per original JSX */}
          {renderButton(ctaPrimaryText, ctaPrimaryHref, onPrimaryClick, 'secondary')}
          {/* Secondary CTA - using 'secondary' variant */}
          {ctaSecondaryText &&
            renderButton(ctaSecondaryText, ctaSecondaryHref, onSecondaryClick, 'secondary')}
        </div>
        {socialProof && (
          <p className="text-sm text-neutral-light/80 max-w-3xl mx-auto" aria-label="Social proof">
            {socialProof}
          </p>
        )}
        {metrics.length > 0 && (
          <dl className="grid gap-spacing-lg md:grid-cols-3 text-left text-neutral-light/90 mt-spacing-xl">
            {metrics.map((metric) => (
              <div key={`${metric.label}-${metric.value}`} className="text-center md:text-left">
                <dt className="text-xs uppercase tracking-wide text-neutral-light/60">
                  {metric.label}
                </dt>
                <dd className="text-font-size-h2 font-bold" aria-label={`${metric.label} value`}>
                  {metric.value}
                </dd>
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