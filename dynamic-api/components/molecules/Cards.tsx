import React from 'react';
import Button from '../ui/Button';

// --- Interfaces ---

interface PricingFeature {
  feature: string;
}

interface Testimonial {
  initials: string;
  name: string;
  event: string;
  quote: string;
}

interface EventMetaItem {
  label: string;
  value: string;
}

// --- Data ---

const pricingFeatures: string[] = [
  '4 uur DJ service',
  'Premium geluidssysteem',
  'Lichtshow Deluxe',
  'Onbeperkte verzoeknummers',
  'Persoonlijk intakegesprek',
];

const testimonials: Testimonial[] = [
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

const eventMeta: EventMetaItem[] = [
  { label: 'Locatie', value: 'Eindhoven' },
  { label: 'Gasten', value: '150' },
  { label: 'Genre focus', value: 'House, Classics, R&B' },
];

// --- Components ---

const PricingCard: React.FC = () => (
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
    <ul className="space-y-spacing-sm text-sm text-neutral-dark" aria-label="Pakket kenmerken">
      {pricingFeatures.map((feature) => (
        <li key={feature} className="flex items-center gap-spacing-sm">
          <span className="size-2 rounded-full bg-secondary" aria-hidden="true" />
          {feature}
        </li>
      ))}
    </ul>
    <Button size="lg" className="w-full">
      Boek dit pakket
    </Button>
  </article>
);

const TestimonialCard: React.FC<{ testimonial: Testimonial }> = ({ testimonial }) => (
  <article
    key={testimonial.name}
    className="flex flex-col gap-spacing-sm rounded-3xl border border-neutral-gray-100 bg-neutral-light/80 p-spacing-xl shadow-lg"
  >
    <div className="flex items-center gap-spacing-md">
      <div className="flex size-12 items-center justify-center rounded-full bg-primary text-base font-bold text-neutral-light" aria-hidden="true">
        {testimonial.initials}
      </div>
      <div>
        <p className="font-semibold text-neutral-dark">{testimonial.name}</p>
        <p className="text-sm text-neutral-gray-500">{testimonial.event}</p>
      </div>
    </div>
    <blockquote className="text-neutral-dark">
      <p className="text-base italic leading-relaxed">&ldquo;{testimonial.quote}&rdquo;</p>
    </blockquote>
  </article>
);

const EventMetaCard: React.FC<{ item: EventMetaItem }> = ({ item }) => (
  <div className="flex items-center justify-between border-b border-neutral-gray-100 py-spacing-sm last:border-b-0">
    <p className="text-sm font-medium text-neutral-gray-500">{item.label}</p>
    <p className="text-sm font-semibold text-neutral-dark">{item.value}</p>
  </div>
);

const Cards: React.FC = () => (
  <div className="p-8">
    <header className="mb-spacing-xl">
      <h1 className="text-font-size-h1 font-bold text-neutral-dark">Molecules: Cards</h1>
      <p className="text-lg text-neutral-gray-500">Herbruikbare kaarten voor pricing, testimonials en event-highlights binnen Mister DJ.</p>
    </header>
    <div className="grid gap-spacing-xl lg:grid-cols-3">
      <PricingCard />

      <div className="space-y-spacing-md">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.name} testimonial={testimonial} />
        ))}
      </div>

      <article className="flex flex-col gap-spacing-md rounded-3xl border border-neutral-gray-100 bg-neutral-light/80 p-spacing-xl shadow-lg">
        <h3 className="text-xl font-bold text-neutral-dark">Event Highlights</h3>
        <div className="divide-y divide-neutral-gray-100">
          {eventMeta.map((item) => (
            <EventMetaCard key={item.label} item={item} />
          ))}
        </div>
        <Button variant="ghost" className="mt-spacing-sm">
          Bekijk meer events
        </Button>
      </article>
    </div>
  </div>
);

export default Cards;