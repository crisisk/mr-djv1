import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';

const metrics = [
  { label: 'LCP', target: '< 2.5s', description: 'Hero en above-the-fold content optimaliseren met image compression en caching.' },
  { label: 'INP', target: '< 100ms', description: 'Minimaliseer JS bundels, gebruik code splitting en prioriteer interactieve componenten.' },
  { label: 'CLS', target: '< 0.1', description: 'Reserveren van ruimte voor media, fonts pre-loaden en geen layout shifts na load.' },
];

const tactics = [
  'Gebruik Vite dynamic imports voor hero/video componenten.',
  'Optimaliseer afbeeldingen met moderne formats (WebP, AVIF).',
  'Cache API responses met in-memory layer en HTTP caching.',
  'Monitor Core Web Vitals via Lighthouse CI en GA4.',
];

const Performance = () => (
  <SlideLayout
    title="Performance Optimisation"
    subtitle="Guidelines om Core Web Vitals te halen en een snelle gebruikerservaring te garanderen."
  >
    <div className="grid gap-spacing-xl md:grid-cols-2">
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Core Web Vitals</h3>
        <div className="space-y-spacing-md">
          {metrics.map((metric) => (
            <div key={metric.label} className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-lg shadow-md">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-semibold uppercase tracking-wide text-primary">{metric.label}</span>
                <span className="text-sm text-neutral-dark">{metric.target}</span>
              </div>
              <p className="mt-spacing-sm text-sm text-neutral-gray-600">{metric.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Tactieken</h3>
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-lg">
          <ul className="space-y-spacing-sm text-sm text-neutral-dark">
            {tactics.map((tactic) => (
              <li key={tactic}>{tactic}</li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  </SlideLayout>
);

export default Performance;
