import type { ReactNode } from 'react';
import { Button } from './Button';

export interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaPrimaryText: string;
  ctaSecondaryText?: string;
  backgroundClass?: string;
  titleColor?: string;
  subtitleColor?: string;
  children?: ReactNode;
}

export function HeroSection({
  title,
  subtitle,
  ctaPrimaryText,
  ctaSecondaryText,
  backgroundClass = 'bg-neutral-dark',
  titleColor = 'text-secondary',
  subtitleColor = 'text-neutral-light',
  children,
}: HeroSectionProps) {
  return (
    <section className={`${backgroundClass} py-spacing-3xl px-spacing-xl min-h-[60vh] flex items-center`}>
      <div className="container mx-auto text-center space-y-spacing-xl">
        <div>
          <h1 className={`heading-1 ${titleColor} mb-spacing-md`}>{title}</h1>
          <p className={`lead mb-spacing-xl max-w-4xl mx-auto ${subtitleColor}`}>{subtitle}</p>
        </div>
        <div className="flex justify-center gap-spacing-md flex-wrap">
          <Button variant="secondary" size="lg">
            {ctaPrimaryText}
          </Button>
          {ctaSecondaryText ? (
            <Button variant="outline" size="lg">
              {ctaSecondaryText}
            </Button>
          ) : null}
        </div>
        {children}
      </div>
    </section>
  );
}

export default HeroSection;
