import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';
import { trackEvent } from '../../lib/analytics.js';

const primaryStats = [
  { label: 'Events', value: '2500+' },
  { label: 'Reviews', value: '10/10' },
  { label: 'Jaar ervaring', value: '15+' },
];

const localFeatures = ['15+ jaar ervaring', '100% dansgarantie', 'Lokale kennis'];

const HeroSections = () => (
  <SlideLayout
    title="Organisms: Hero Sections"
    subtitle="Hero varianten voor home en lokale SEO pagina’s met sterke propositie en duidelijke CTA’s."
  >
    <div className="space-y-spacing-xl">
      <section className="grid gap-spacing-xl rounded-3xl border border-neutral-gray-100 bg-neutral-dark/95 p-spacing-xl text-neutral-light shadow-xl md:grid-cols-2">
        <div className="space-y-spacing-md">
          <span className="inline-flex items-center gap-spacing-xs rounded-full bg-secondary/20 px-spacing-md py-spacing-xs text-xs font-semibold uppercase tracking-wide text-secondary">
            ✨ 100% Dansgarantie
          </span>
          <h3 className="text-font-size-h1 font-extrabold leading-tight">
            Jouw feest, <span className="text-secondary">onvergetelijk</span> gemaakt
          </h3>
          <p className="text-font-size-body text-neutral-light/80">
            Professionele DJ service voor bruiloften en bedrijfsfeesten in heel Brabant. 15+ jaar ervaring, 2500+ geslaagde events en een dedicated planningsteam.
          </p>
          <div className="flex flex-wrap gap-spacing-sm">
            <Button
              size="lg"
              className="bg-secondary text-neutral-dark hover:bg-secondary/90"
              onClick={() =>
                trackEvent('cta_click', {
                  location: 'hero_primary',
                  persona: 'general',
                })
              }
            >
              Direct beschikbaarheid
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-neutral-light text-neutral-light"
              onClick={() =>
                trackEvent('cta_click', {
                  location: 'hero_secondary',
                  persona: 'general',
                })
              }
            >
              Bekijk pakketten
            </Button>
          </div>
        </div>
        <div className="grid gap-spacing-md rounded-3xl border border-neutral-light/10 bg-neutral-light/5 p-spacing-xl text-neutral-light">
          {primaryStats.map((stat) => (
            <div key={stat.label} className="flex items-center justify-between border-b border-neutral-light/10 pb-spacing-sm last:border-none">
              <span className="text-sm uppercase tracking-wide text-neutral-light/70">{stat.label}</span>
              <span className="text-3xl font-bold">{stat.value}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-spacing-xl rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg md:grid-cols-[2fr,1fr]">
        <div className="space-y-spacing-md">
          <div className="flex items-center gap-spacing-sm text-primary">
            <span role="img" aria-label="locatie">
              📍
            </span>
            <span className="text-sm font-semibold uppercase tracking-wide">Eindhoven</span>
          </div>
          <h3 className="text-font-size-h2 font-bold text-neutral-dark">Bruiloft DJ Eindhoven</h3>
          <p className="text-sm text-neutral-gray-600">
            Op zoek naar een professionele bruiloft DJ in Eindhoven? Mister DJ zorgt voor een onvergetelijke feestavond met 100% dansgarantie.
          </p>
          <div className="flex flex-wrap gap-spacing-sm">
            {localFeatures.map((feature) => (
              <span key={feature} className="rounded-full bg-primary/10 px-spacing-md py-spacing-xs text-sm font-semibold text-primary">
                {feature}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-spacing-sm">
          <Button
            size="lg"
            onClick={() =>
              trackEvent('cta_click', {
                location: 'hero_local_primary',
                persona: 'bruiloft',
              })
            }
          >
            Vraag offerte aan
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() =>
              trackEvent('cta_click', {
                location: 'hero_local_secondary',
                persona: 'bruiloft',
              })
            }
          >
            Bekijk reviews
          </Button>
          </div>
        </div>
        <div className="flex flex-col items-center justify-center gap-spacing-md rounded-3xl border border-neutral-gray-100 bg-neutral-light p-spacing-xl text-center shadow-inner">
          <div className="flex size-20 items-center justify-center rounded-full bg-primary/10 text-primary text-3xl">📅</div>
          <p className="text-sm font-semibold text-neutral-dark">Check beschikbaarheid</p>
          <p className="text-xs text-neutral-gray-500">We bevestigen binnen 24 uur.</p>
        </div>
      </section>
    </div>
  </SlideLayout>
);

export default HeroSections;
