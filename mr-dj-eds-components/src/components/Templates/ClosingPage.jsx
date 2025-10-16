import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';

const timeline = [
  { phase: 'Week 1', details: 'Design tokens finaliseren, Storybook structuur opzetten.' },
  { phase: 'Week 2-3', details: 'Component migratie en documentatie vullen.' },
  { phase: 'Week 4', details: 'QA, accessibility check en livegang.' },
];

const deliverables = ['Volledige component library', 'Documentatie & guidelines', 'Launch checklist & support plan'];

const ClosingPage = () => (
  <SlideLayout
    title="Launch Ready"
    subtitle="Samenvatting van deliverables, tijdlijn en post-launch acties voor het EDS."
  >
    <div className="grid gap-spacing-xl md:grid-cols-2">
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Implementatietijdlijn</h3>
        <div className="space-y-spacing-sm">
          {timeline.map((item) => (
            <div key={item.phase} className="flex items-start gap-spacing-sm rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-lg shadow-md">
              <span className="text-sm font-semibold uppercase tracking-wide text-primary">{item.phase}</span>
              <p className="text-sm text-neutral-gray-600">{item.details}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Deliverables</h3>
        <ul className="space-y-spacing-sm text-sm text-neutral-dark">
          {deliverables.map((item) => (
            <li key={item} className="flex items-center gap-spacing-sm">
              <span className="size-2 rounded-full bg-secondary" />
              {item}
            </li>
          ))}
        </ul>
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-lg">
          <h4 className="text-font-size-h3 font-semibold text-neutral-dark">Volgende stappen</h4>
          <p className="text-sm text-neutral-gray-600">
            Plan een alignment met marketing & sales, zet KPI’s op voor adoptie en plan de volgende increment (design token sync met Figma).
          </p>
          <Button size="lg" className="mt-spacing-md">
            Download go-live checklist
          </Button>
        </div>
      </section>
    </div>
  </SlideLayout>
);

export default ClosingPage;
