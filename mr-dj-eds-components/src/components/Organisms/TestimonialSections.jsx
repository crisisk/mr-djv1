import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import StatHighlights from '../Molecules/StatHighlights.jsx';

const featuredTestimonial = {
  title: '“De dansvloer zat vol van begin tot eind.”',
  quote:
    'Mister DJ nam alle zorg uit handen: perfecte voorbereiding, naadloze samenwerking met de saxofonist en een set die voelde alsof onze vrienden aan de draaitafels stonden.',
  name: 'Eva & Tom',
  meta: 'Bruiloft • Kasteel Maurick • 180 gasten',
};

const testimonialCards = [
  {
    name: 'Lisa & Mark',
    meta: 'Bruiloft • Tilburg',
    quote: 'De intake was super persoonlijk en onze playlist werd tot in detail verwerkt.',
  },
  {
    name: 'Philips Lighting',
    meta: 'Corporate Event • 450 gasten',
    quote: 'Heldere communicatie, strakke productie en een gegarandeerde volle dansvloer.',
  },
  {
    name: 'Sanne',
    meta: 'Verjaardag • Eindhoven',
    quote: 'Van licht tot geluid tot MC: alles liep vlekkeloos. Onze gasten praten er nog steeds over.',
  },
];

const stats = [
  {
    label: 'Gemiddelde reviewscore',
    value: '9,8',
    description: 'Op basis van 250+ recensies via ThePerfectWedding, Google en Trustpilot.',
  },
  {
    label: 'Aanvragen binnen 24 uur beantwoord',
    value: '100%',
    description: 'Dedicated planningsteam dat elke lead persoonlijk opvolgt.',
  },
  {
    label: 'Succesvolle evenementen in 2024',
    value: '312',
    description: 'Van intieme bruiloften tot corporate events met 1000+ gasten.',
  },
];

const TestimonialCard = ({ name, meta, quote }) => (
  <article className="flex flex-col gap-spacing-sm rounded-2xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-lg shadow-md">
    <div className="flex gap-spacing-sm text-secondary">
      {Array.from({ length: 5 }).map((_, index) => (
        <span key={index}>★</span>
      ))}
    </div>
    <p className="text-sm text-neutral-gray-600">“{quote}”</p>
    <div>
      <p className="font-semibold text-neutral-dark">{name}</p>
      <p className="text-xs text-neutral-gray-500">{meta}</p>
    </div>
  </article>
);

const TestimonialSections = () => (
  <SlideLayout
    title="Organisms: Testimonials"
    subtitle="Social proof secties met hero testimonial, quotes en onderbouwende statistieken."
  >
    <div className="grid gap-spacing-xl xl:grid-cols-[3fr,2fr]">
      <section className="space-y-spacing-xl">
        <article className="space-y-spacing-sm rounded-3xl border border-primary/30 bg-primary/5 p-spacing-xl shadow-xl">
          <p className="text-font-size-h3 font-semibold text-primary">{featuredTestimonial.title}</p>
          <p className="text-sm text-neutral-dark/80">{featuredTestimonial.quote}</p>
          <div>
            <p className="text-sm font-semibold text-neutral-dark">{featuredTestimonial.name}</p>
            <p className="text-xs text-neutral-gray-500">{featuredTestimonial.meta}</p>
          </div>
        </article>
        <div className="grid gap-spacing-md md:grid-cols-3">
          {testimonialCards.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </section>
      <aside>
        <StatHighlights stats={stats} title="Waarom Mister DJ" subtitle="Onze belofte in cijfers." orientation="vertical" />
      </aside>
    </div>
  </SlideLayout>
);

export default TestimonialSections;
