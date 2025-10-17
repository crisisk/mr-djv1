import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';

const breakpoints = [
  { label: 'Mobile', spec: '0 - 639px', notes: 'Single column, CTA’s full width, 16px padding' },
  { label: 'Tablet', spec: '640 - 1023px', notes: '2 koloms layout, CTA naast elkaar, 24px padding' },
  { label: 'Desktop', spec: '1024 - 1439px', notes: '3 koloms grid, hero split layout, 32px padding' },
  { label: 'Wide', spec: '≥ 1440px', notes: 'Max-width 1200px, extra whitespace en illustraties' },
];

const ResponsivePatterns = () => (
  <SlideLayout
    title="Responsive Patterns"
    subtitle="Breakpoints en componentgedrag voor alle devices."
  >
    <div className="space-y-spacing-xl">
      <section className="grid gap-spacing-md md:grid-cols-4">
        {breakpoints.map((bp) => (
          <div key={bp.label} className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-lg shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">{bp.label}</p>
            <p className="text-sm text-neutral-dark">{bp.spec}</p>
            <p className="text-xs text-neutral-gray-500">{bp.notes}</p>
          </div>
        ))}
      </section>
      <section className="grid gap-spacing-md md:grid-cols-3">
        <div className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Mobile</p>
          <p className="text-sm text-neutral-gray-600">Stapel hero, testimonials en CTA’s onder elkaar. Buttons full width.</p>
        </div>
        <div className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Tablet</p>
          <p className="text-sm text-neutral-gray-600">Gebruik 2-koloms grids, centreer belangrijke CTA’s en behoud 24px gutters.</p>
        </div>
        <div className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">Desktop</p>
          <p className="text-sm text-neutral-gray-600">Hero met split layout, testimonials in 3 kolommen, CTA met secundaire actie.</p>
        </div>
      </section>
    </div>
  </SlideLayout>
);

export default ResponsivePatterns;
