import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';

const localFeatures = ['15+ jaar ervaring', '100% dansgarantie', 'Lokale venues kennis'];
const venues = ['De Kazerne, Eindhoven', 'Het Ketelhuis, Eindhoven', 'Van der Valk Hotel, Veldhoven'];
const reviews = ['“Onze gasten kwamen van ver, maar de dansvloer stond vol!” – Anne & Koen', '“Zakelijk event met live sax – indrukwekkend.” – Philips Health'];

const LocalSEOPage = () => (
  <SlideLayout
    title="Template: Local SEO"
    subtitle="Structuur voor city-specifieke landingspagina’s inclusief hero, social proof en SEO copy."
  >
    <div className="grid gap-spacing-xl md:grid-cols-[2fr,1fr]">
      <section className="space-y-spacing-md rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
        <div className="flex items-center gap-spacing-sm text-primary">
          <span role="img" aria-label="locatie">📍</span>
          <span className="text-sm font-semibold uppercase tracking-wide">Eindhoven</span>
        </div>
        <h3 className="text-font-size-h2 font-bold text-neutral-dark">Bruiloft DJ Eindhoven</h3>
        <p className="text-sm text-neutral-gray-600">
          Onvergetelijke bruiloften en events in Eindhoven met 100% dansgarantie. Persoonlijke aanpak, lokale partners en flexibele pakketten.
        </p>
        <div className="flex flex-wrap gap-spacing-sm">
          {localFeatures.map((feature) => (
            <span key={feature} className="rounded-full bg-primary/10 px-spacing-md py-spacing-xs text-sm font-semibold text-primary">
              {feature}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-spacing-sm">
          <Button size="lg">Vraag offerte aan</Button>
          <Button variant="outline" size="lg">
            Bekijk reviews
          </Button>
        </div>
      </section>
      <aside className="space-y-spacing-md">
        <div className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-md">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">Populaire locaties</h4>
          <ul className="mt-spacing-sm space-y-spacing-xs text-sm text-neutral-dark">
            {venues.map((venue) => (
              <li key={venue}>{venue}</li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-md">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">Lokale reviews</h4>
          <ul className="mt-spacing-sm space-y-spacing-xs text-sm text-neutral-dark">
            {reviews.map((quote) => (
              <li key={quote}>“{quote}”</li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  </SlideLayout>
);

export default LocalSEOPage;
