import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';

const docPoints = [
  {
    title: 'Storybook integratie',
    description: 'Alle componenten zijn gedocumenteerd met live voorbeelden, props en best practices.',
  },
  {
    title: 'Prop tabellen',
    description: 'Consistente tabellen met type, beschrijving en standaardwaarde voor iedere variant.',
  },
  {
    title: "Do's & dont's",
    description: 'Visuele voorbeelden met aanbevolen en te vermijden toepassingen voor elk patroon.',
  },
];

const Documentation = () => (
  <SlideLayout
    title="Documentation & Usage"
    subtitle="Richtlijnen voor teams om componenten correct toe te passen en te onderhouden."
  >
    <div className="grid gap-spacing-xl md:grid-cols-2">
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Component documentatie</h3>
        <div className="space-y-spacing-md">
          {docPoints.map((point) => (
            <div key={point.title} className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-lg shadow-md">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">{point.title}</h4>
              <p className="text-sm text-neutral-gray-600">{point.description}</p>
            </div>
          ))}
        </div>
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-lg">
          <h4 className="text-font-size-h3 font-semibold text-neutral-dark">Developer workflow</h4>
          <ul className="mt-spacing-sm space-y-spacing-xs text-sm text-neutral-dark">
            <li>Importeer componenten via <code>@mrdj/eds-components</code>.</li>
            <li>Gebruik tokens in plaats van hardcoded waarden.</li>
            <li>Voer visuele regressietests uit na elke update.</li>
          </ul>
        </div>
      </section>
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Code voorbeelden</h3>
        <div className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-md">
          <pre className="overflow-x-auto rounded-2xl bg-neutral-dark/90 p-spacing-md text-xs text-neutral-light">
{`import { Button } from '@mrdj/eds-components';
import { trackEvent } from '@mrdj/eds-components/lib/analytics';

const Example = () => (
  <Button variant="default" size="lg" onClick={() => trackEvent('cta_click', { source: 'docs_example' })}>
    Boek nu
  </Button>
);`}
          </pre>
          <p className="mt-spacing-sm text-xs text-neutral-gray-500">
            Gebruik tokens voor spacing (<code>px-spacing-lg</code>) en kleur (<code>text-primary</code>) om consistentie te borgen.
          </p>
        </div>
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-lg space-y-spacing-sm">
          <h4 className="text-font-size-h3 font-semibold text-neutral-dark">Enterprise componenten</h4>
          <p className="text-sm text-neutral-dark">
            Stat Highlights en Persona Match Showcase ondersteunen sales & marketing en zijn opgenomen in de DJ + Sax template.
          </p>
          <Button size="sm" variant="secondary" className="self-start">
            Open Storybook
          </Button>
        </div>
      </section>
    </div>
  </SlideLayout>
);

export default Documentation;
