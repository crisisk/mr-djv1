'use client';

import React from 'react';
import Button from '../ui/Button';
import { trackEvent } from '../../lib/analytics';

// --- Interfaces ---

interface Stat {
  label: string;
  value: string;
}

// --- Data ---

const primaryStats: Stat[] = [
  { label: 'Events', value: '2500+' },
  { label: 'Reviews', value: '10/10' },
  { label: 'Jaar ervaring', value: '15+' },
];

const localFeatures: string[] = ['15+ jaar ervaring', '100% dansgarantie', 'Lokale kennis'];

// --- Component ---

const HeroSections: React.FC = () => {
  const handlePrimaryCtaClick = () => {
    trackEvent('cta_click', {
      location: 'hero_primary',
      persona: 'general',
    });
  };

  const handleSecondaryCtaClick = () => {
    trackEvent('cta_click', {
      location: 'hero_secondary',
      persona: 'general',
    });
  };

  const handleLocalCtaClick = () => {
    trackEvent('cta_click', {
      location: 'hero_local',
      persona: 'local_seo',
    });
  };

  return (
    <div className="space-y-spacing-xl">
      {/* Hero Variant 1: Primary Proposition */}
      <section className="grid gap-spacing-xl rounded-3xl border border-neutral-gray-100 bg-neutral-dark/95 p-spacing-xl text-neutral-light shadow-xl md:grid-cols-2">
        <div className="space-y-spacing-md">
          <span className="inline-flex items-center gap-spacing-xs rounded-full bg-secondary/20 px-spacing-md py-spacing-xs text-xs font-semibold uppercase tracking-wide text-secondary">
            ✨ 100% Dansgarantie
          </span>
          <h2 className="text-font-size-h1 font-extrabold leading-tight">
            Jouw feest, <span className="text-secondary">onvergetelijk</span> gemaakt
          </h2>
          <p className="text-font-size-body text-neutral-light/80">
            Professionele DJ service voor bruiloften en bedrijfsfeesten in heel Brabant. 15+ jaar ervaring, 2500+ geslaagde events en een dedicated planningsteam.
          </p>
          <div className="flex flex-wrap gap-spacing-sm pt-spacing-sm">
            <Button
              size="lg"
              variant="secondary"
              className="text-neutral-dark"
              onClick={handlePrimaryCtaClick}
              aria-label="Direct beschikbaarheid controleren"
            >
              Direct beschikbaarheid
            </Button>
            <Button
              variant="ghost"
              size="lg"
              className="border border-neutral-light text-neutral-light hover:bg-neutral-light/10"
              onClick={handleSecondaryCtaClick}
              aria-label="Bekijk onze pakketten"
            >
              Bekijk pakketten
            </Button>
          </div>
        </div>
        <div className="grid gap-spacing-md rounded-3xl border border-neutral-light/10 bg-neutral-light/5 p-spacing-xl text-neutral-light" role="list">
          <h3 className="sr-only">Kernstatistieken</h3>
          {primaryStats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between border-b border-neutral-light/10 pb-spacing-sm last:border-none" role="listitem">
              <span className="text-sm uppercase tracking-wide text-neutral-light/70">{stat.label}</span>
              <span className="text-3xl font-bold">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Hero Variant 2: Local SEO Proposition */}
      <section className="grid gap-spacing-xl rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl md:grid-cols-2">
        <div className="space-y-spacing-md">
          <span className="inline-flex items-center gap-spacing-xs rounded-full bg-primary/20 px-spacing-md py-spacing-xs text-xs font-semibold uppercase tracking-wide text-primary">
            📍 Lokale Expert
          </span>
          <h2 className="text-font-size-h1 font-extrabold leading-tight text-neutral-dark">
            De beste DJ voor jouw feest in <span className="text-primary">Breda</span>
          </h2>
          <p className="text-font-size-body text-neutral-dark/80">
            Wij kennen de locaties, de mensen en de sfeer van Breda. Kies voor een lokale DJ die jouw evenement perfect aanvoelt en onvergetelijk maakt.
          </p>
          <div className="flex flex-wrap gap-spacing-sm pt-spacing-sm">
            <Button
              size="lg"
              variant="primary"
              onClick={handleLocalCtaClick}
              aria-label="Vraag een offerte aan voor Breda"
            >
              Vraag offerte aan (Breda)
            </Button>
          </div>
        </div>
        <div className="space-y-spacing-md rounded-3xl border border-primary/20 bg-white p-spacing-xl shadow-lg">
          <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Waarom lokaal?</h3>
          <ul className="space-y-spacing-sm text-neutral-dark" role="list">
            {localFeatures.map((feature) => (
              <li key={feature} className="flex items-start gap-spacing-sm" role="listitem">
                <svg
                  className="mt-1 h-5 w-5 flex-shrink-0 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-font-size-body">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default HeroSections;