import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';

const animationUseCases = [
  {
    title: 'Micro-interactions',
    description: 'Buttons, toggles en formulierfeedback met subtiele easing (200ms, ease-out).',
  },
  {
    title: 'Page transitions',
    description: 'Crossfade en slide transitions tussen landingspagina’s om context te behouden.',
  },
  {
    title: 'Scroll animaties',
    description: 'Reveal animaties voor statistieken en testimonials bij 40% viewport threshold.',
  },
];

const Animations = () => (
  <SlideLayout
    title="Animations & Transitions"
    subtitle="Richtlijnen voor motion design binnen Mister DJ: functioneel, lichtgewicht en performant."
  >
    <div className="grid gap-spacing-xl md:grid-cols-2">
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Use cases</h3>
        <div className="space-y-spacing-md">
          {animationUseCases.map((item) => (
            <div key={item.title} className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-lg shadow-md">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-primary">{item.title}</h4>
              <p className="text-sm text-neutral-gray-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Guidelines</h3>
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl shadow-lg text-sm text-neutral-dark">
          <ul className="space-y-spacing-sm">
            <li><strong>Duur:</strong> 150-300ms voor UI interacties, 500ms voor page transitions.</li>
            <li><strong>Easing:</strong> Gebruik cubic-bezier (0.4, 0, 0.2, 1) voor natuurlijke beweging.</li>
            <li><strong>Performance:</strong> Beperk animaties tot transform en opacity voor GPU versnelling.</li>
            <li><strong>Accessibility:</strong> Respecteer <code>prefers-reduced-motion</code> en bied alternatieve feedback.</li>
          </ul>
        </div>
      </section>
    </div>
  </SlideLayout>
);

export default Animations;
