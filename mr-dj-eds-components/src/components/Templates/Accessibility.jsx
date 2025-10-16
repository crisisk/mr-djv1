import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';

const checklist = [
  {
    title: 'WCAG 2.1 AA',
    items: ['Contrast ratio ≥ 4.5:1', 'Toetsenbord navigatie op alle interactieve elementen', 'Focus states zichtbaar en consistent'],
  },
  {
    title: 'Form validation',
    items: ['Inline foutmeldingen gekoppeld aan inputs', 'ARIA-live region voor succes/fout feedback', 'Labels altijd gekoppeld aan form elementen'],
  },
  {
    title: 'Media',
    items: ['Ondertiteling voor video’s', 'Alternatieve tekst voor afbeeldingen', 'Transcript voor audio content'],
  },
];

const Accessibility = () => (
  <SlideLayout
    title="Accessibility"
    subtitle="Patronen en richtlijnen om WCAG 2.1 AA te behalen en inclusieve ervaringen te garanderen."
  >
    <div className="grid gap-spacing-xl md:grid-cols-2">
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Checklist</h3>
        <div className="space-y-spacing-md">
          {checklist.map((category) => (
            <div key={category.title} className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-lg shadow-md">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">{category.title}</h4>
              <ul className="mt-spacing-sm space-y-spacing-xs text-sm text-neutral-gray-600">
                {category.items.map((item) => (
                  <li key={item} className="flex items-start gap-spacing-sm">
                    <span className="mt-1 size-2 rounded-full bg-success" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Best practices</h3>
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-lg">
          <p className="text-sm text-neutral-dark">
            Combineer design tokens met aria-attributen om consistentie te behouden en toegankelijkheid te garanderen. Gebruik Storybook accessibility add-on om regressies vroegtijdig op te sporen.
          </p>
          <div className="mt-spacing-md space-y-spacing-sm text-sm text-neutral-dark">
            <p>
              <strong>Focus management:</strong> gebruik <code>focus-visible</code> utilities en logische tabvolgorde.
            </p>
            <p>
              <strong>Semantic HTML:</strong> zet content op in headings, lists en landmarks voor screenreaders.
            </p>
            <p>
              <strong>Dark mode:</strong> check contrast opnieuw wanneer kleuren wisselen.
            </p>
          </div>
        </div>
        <div className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-md">
          <h4 className="text-font-size-h3 font-semibold text-neutral-dark">Audit cadence</h4>
          <p className="text-sm text-neutral-gray-600">Uitgebreide audit per kwartaal, snelle check bij elke release.</p>
        </div>
      </section>
    </div>
  </SlideLayout>
);

export default Accessibility;
