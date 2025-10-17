import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';

const homepageSections = [
  { title: 'Hero', description: 'Sterke belofte, USP badges en dubbele CTA.' },
  { title: 'Services', description: 'Kaarten met iconen voor Bruiloft, Corporate, DJ + Sax.' },
  { title: 'Pricing', description: '3 pakketten met feature matrix en CTA.' },
  { title: 'Testimonials', description: 'Carousel + Stat Highlights.' },
  { title: 'CTA', description: 'Vraag offerte aan met availability checker.' },
  { title: 'Footer', description: 'Navigatie, contact, social proof badges.' },
];

const HomepageLayout = () => (
  <SlideLayout
    title="Template: Homepage"
    subtitle="Structuur van de primaire landingspagina inclusief component mapping."
  >
    <div className="grid gap-spacing-xl md:grid-cols-[2fr,1fr]">
      <section className="space-y-spacing-md rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Hoofdstructuur</h3>
        <ol className="space-y-spacing-sm text-sm text-neutral-dark">
          {homepageSections.map((section, index) => (
            <li key={section.title} className="flex gap-spacing-sm">
              <span className="text-primary font-semibold">{index + 1}.</span>
              <div>
                <p className="font-semibold">{section.title}</p>
                <p className="text-xs text-neutral-gray-500">{section.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
      <aside className="space-y-spacing-md rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-lg">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Belangrijkste CTA</h3>
        <p className="text-sm text-neutral-dark">
          Plaats beschikbaarheids-checker boven de fold én herhaal onder testimonials voor maximale conversie.
        </p>
        <Button size="lg" className="w-full">
          Bekijk wireframe
        </Button>
      </aside>
    </div>
  </SlideLayout>
);

export default HomepageLayout;
