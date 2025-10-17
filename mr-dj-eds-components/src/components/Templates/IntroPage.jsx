import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';

const benefits = [
  {
    title: 'Consistente merkbeleving',
    description: 'Elke pagina – van homepage tot error page – ademt Mister DJ dankzij gedeelde componenten en tokens.',
  },
  {
    title: 'Snellere development',
    description: 'Herbruikbare patterns verkorten de time-to-market met 30-50% en verminderen QA-issues.',
  },
  {
    title: 'Hogere kwaliteit & toegankelijkheid',
    description: 'Componenten zijn WCAG getest, performantie geoptimaliseerd en makkelijk te onderhouden.',
  },
];

const IntroPage = () => (
  <SlideLayout
    title="Design System Overview"
    subtitle="Het Mister DJ Enterprise Design System is de single source of truth voor design, content en development teams."
  >
    <div className="grid gap-spacing-xl md:grid-cols-2">
      <div className="space-y-spacing-lg text-neutral-dark">
        <p className="text-font-size-body">
          Het Enterprise Design System (EDS) combineert atomic design principes met onze merkidentiteit. Teams gebruiken dezelfde
          tokens, componenten en documentatie om consistente, schaalbare en meetbare ervaringen te leveren over alle touchpoints.
        </p>
        <div className="space-y-spacing-md">
          {benefits.map((benefit, index) => (
            <div key={benefit.title} className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-lg shadow-md">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">Stap {index + 1}</p>
              <h3 className="text-font-size-h3 font-semibold text-neutral-dark">{benefit.title}</h3>
              <p className="text-sm text-neutral-gray-600">{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-spacing-md rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl text-center shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">Atomic Design</p>
        <h3 className="text-font-size-h2 font-bold text-neutral-dark">Atoms → Molecules → Organisms → Templates</h3>
        <p className="text-sm text-neutral-gray-600">
          Elk component is modulair opgebouwd en getest binnen Storybook, zodat teams varianten eenvoudig kunnen combineren en documenteren.
        </p>
      </div>
    </div>
  </SlideLayout>
);

export default IntroPage;
