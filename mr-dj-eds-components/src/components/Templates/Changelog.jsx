import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';

const releases = [
  {
    version: 'v1.0.0',
    date: 'Feb 2025',
    changes: ['Launch core tokens & component library', 'Storybook documentatie en starter templates', 'CI pipeline voor lint/test/build'],
  },
  {
    version: 'v1.1.0',
    date: 'Apr 2025',
    changes: ['Persona Match Showcase toegevoegd', 'Nieuwe Stat Highlights molecule', 'Performance optimalisaties (lazy loading)'],
  },
];

const roadmap = [
  { item: 'Design token synchronisatie met Figma', status: 'In progress' },
  { item: 'Visuele regressietests in CI', status: 'Planned' },
  { item: 'Marketing portal integratie', status: 'Planned' },
];

const Changelog = () => (
  <SlideLayout
    title="Changelog"
    subtitle="Versie-overzicht en roadmap voor het Mister DJ Enterprise Design System."
  >
    <div className="grid gap-spacing-xl md:grid-cols-2">
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Releases</h3>
        <div className="space-y-spacing-md">
          {releases.map((release) => (
            <article key={release.version} className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-md">
              <div className="flex items-baseline justify-between">
                <h4 className="text-font-size-h3 font-semibold text-primary">{release.version}</h4>
                <span className="text-xs uppercase tracking-wide text-neutral-gray-500">{release.date}</span>
              </div>
              <ul className="mt-spacing-sm space-y-spacing-xs text-sm text-neutral-gray-600">
                {release.changes.map((change) => (
                  <li key={change} className="flex gap-spacing-sm">
                    <span className="mt-[6px] size-1.5 rounded-full bg-secondary" />
                    {change}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Roadmap</h3>
        <div className="space-y-spacing-md">
          {roadmap.map((entry) => (
            <div key={entry.item} className="flex items-center justify-between rounded-3xl border border-primary/20 bg-primary/5 p-spacing-lg shadow-sm">
              <p className="text-sm text-neutral-dark">{entry.item}</p>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">{entry.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  </SlideLayout>
);

export default Changelog;
