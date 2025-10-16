import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';

const pricingFeatures = ['4 uur DJ service', 'Premium geluidssysteem', 'Lichtshow Deluxe', 'Onbeperkte verzoeknummers', 'Persoonlijk intakegesprek'];

const testimonials = [
  {
    initials: 'JM',
    name: 'Jan & Marie',
    event: 'Bruiloft • 15 juni 2024',
    quote:
      'Mister DJ tilde onze bruiloft naar een hoger niveau. De dansvloer zat vol van openingsdans tot laatste plaat.',
  },
  {
    initials: 'RS',
    name: 'Ronald (Philips)',
    event: 'Bedrijfsfeest • 450 gasten',
    quote: 'De combinatie DJ + sax gaf precies de energie die we zochten. Professioneel, strak en flexibel.',
  },
];

const eventMeta = [
  { label: 'Locatie', value: 'Eindhoven' },
  { label: 'Gasten', value: '150' },
  { label: 'Genre focus', value: 'House, Classics, R&B' },
];

const Cards = () => (
  <SlideLayout
    title="Molecules: Cards"
    subtitle="Herbruikbare kaarten voor pricing, testimonials en event-highlights binnen Mister DJ."
  >
    <div className="grid gap-spacing-xl lg:grid-cols-3">
      <article className="flex flex-col gap-spacing-md rounded-3xl border border-primary/20 bg-neutral-light/90 p-spacing-xl shadow-xl">
        <header className="space-y-spacing-xs">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Populair pakket</p>
          <h3 className="text-font-size-h2 font-bold text-neutral-dark">Zilver</h3>
          <p className="text-sm text-neutral-gray-500">Ideaal voor bruiloften met 100-200 gasten.</p>
        </header>
        <div className="flex items-baseline gap-spacing-sm">
          <span className="text-4xl font-extrabold text-neutral-dark">€995</span>
          <span className="text-sm text-neutral-gray-500">excl. btw</span>
        </div>
        <ul className="space-y-spacing-sm text-sm text-neutral-dark">
          {pricingFeatures.map((feature) => (
            <li key={feature} className="flex items-center gap-spacing-sm">
              <span className="size-2 rounded-full bg-secondary" />
              {feature}
            </li>
          ))}
        </ul>
        <Button size="lg" className="w-full">
          Boek dit pakket
        </Button>
      </article>

      <div className="space-y-spacing-md">
        {testimonials.map((testimonial) => (
          <article
            key={testimonial.name}
            className="flex flex-col gap-spacing-sm rounded-3xl border border-neutral-gray-100 bg-neutral-light/80 p-spacing-xl shadow-lg"
          >
            <div className="flex items-center gap-spacing-md">
              <div className="flex size-12 items-center justify-center rounded-full bg-primary text-base font-bold text-neutral-light">
                {testimonial.initials}
              </div>
              <div>
                <p className="font-semibold text-neutral-dark">{testimonial.name}</p>
                <p className="text-sm text-neutral-gray-500">{testimonial.event}</p>
              </div>
            </div>
            <div className="flex gap-1 text-secondary">
              {Array.from({ length: 5 }).map((_, index) => (
                <span key={index}>★</span>
              ))}
            </div>
            <p className="text-sm leading-relaxed text-neutral-gray-600">“{testimonial.quote}”</p>
          </article>
        ))}
      </div>

      <article className="flex h-full flex-col justify-between gap-spacing-md rounded-3xl border border-neutral-gray-100 bg-primary/5 p-spacing-xl shadow-lg">
        <div className="space-y-spacing-sm">
          <div className="flex items-center gap-spacing-sm text-primary">
            <span className="text-3xl">🎵</span>
            <span className="text-sm font-semibold uppercase tracking-wide">Recente case</span>
          </div>
          <h3 className="text-font-size-h2 font-bold text-neutral-dark">Bruiloft Eindhoven</h3>
          <p className="text-sm text-neutral-gray-600">
            High-energy avond met live sax, custom openingsmix en 150 gasten op de dansvloer.
          </p>
        </div>
        <dl className="space-y-spacing-sm text-sm text-neutral-dark">
          {eventMeta.map((meta) => (
            <div key={meta.label} className="flex justify-between rounded-2xl bg-neutral-light px-spacing-md py-spacing-sm">
              <dt className="font-semibold text-neutral-gray-600">{meta.label}</dt>
              <dd className="font-semibold text-neutral-dark">{meta.value}</dd>
            </div>
          ))}
        </dl>
        <Button variant="outline" size="lg">
          Bekijk volledige case
        </Button>
      </article>
    </div>
  </SlideLayout>
);

export default Cards;
