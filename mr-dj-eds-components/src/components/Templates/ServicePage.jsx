import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';

const services = [
  {
    name: 'Bruiloft DJ',
    highlight: 'Romantische openingsdans, 100% dansgarantie en persoonlijke intake.',
  },
  {
    name: 'Bedrijfsfeest DJ',
    highlight: 'Corporate energie met live sax, branding en hybride opties.',
  },
  {
    name: 'Private events',
    highlight: 'Maatwerk muziek, licht en MC voor verjaardagen en jubilea.',
  },
];

const ServicePage = () => (
  <SlideLayout
    title="Template: Service Page"
    subtitle="Opbouw voor de drie hoofddiensten inclusief hero, USP’s en conversie blokken."
  >
    <div className="grid gap-spacing-xl md:grid-cols-[2fr,1fr]">
      <section className="space-y-spacing-md rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Hero</h3>
        <p className="text-sm text-neutral-gray-600">
          Start met een hero waarin de dienstnaam, duidelijke belofte en primaire CTA centraal staan. Voeg badges toe (ervaring, reviews) voor vertrouwen.
        </p>
        <div className="space-y-spacing-sm">
          {services.map((service) => (
            <div key={service.name} className="rounded-3xl border border-neutral-gray-100 bg-neutral-light px-spacing-lg py-spacing-md shadow-sm">
              <p className="text-sm font-semibold text-neutral-dark">{service.name}</p>
              <p className="text-xs text-neutral-gray-500">{service.highlight}</p>
            </div>
          ))}
        </div>
      </section>
      <aside className="space-y-spacing-md rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-lg">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Call-to-action</h3>
        <p className="text-sm text-neutral-dark">
          Plaats een availability checker en toon secundaire CTA voor consult of brochure.
        </p>
        <Button size="lg" className="w-full">
          Start booking
        </Button>
      </aside>
    </div>
  </SlideLayout>
);

export default ServicePage;
