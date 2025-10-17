import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';

const headings = [
  { level: 'H1', sample: 'Bruiloft DJ met 100% dansgarantie', className: 'text-font-size-h1', usage: 'Hero headlines, key marketing claims' },
  { level: 'H2', sample: 'Waarom kiezen voor Mister DJ', className: 'text-font-size-h2', usage: 'Sectietitels, hoofdstukken in decks' },
  { level: 'H3', sample: 'Live saxofonist inbegrepen', className: 'text-font-size-h3', usage: 'Subsecties, feature highlights' },
];

const bodyStyles = [
  { label: 'Body', className: 'text-font-size-body', usage: 'Paragrafen, component copy' },
  { label: 'Small', className: 'text-font-size-small', usage: 'Captions, helptekst, label toelichtingen' },
];

const TypographySystem = () => (
  <SlideLayout
    title="Atoms: Typografie"
    subtitle="Consistente typografische schaal gebaseerd op Montserrat voor impactvolle copy en toegankelijke leesbaarheid."
  >
    <div className="grid gap-spacing-xl md:grid-cols-2">
      <div className="space-y-spacing-lg">
        <h3 className="text-font-size-h3 font-bold text-primary">Headings & Body</h3>
        <div className="flex flex-col gap-spacing-lg">
          {headings.map(({ level, sample, className, usage }) => (
            <div key={level} className="rounded-2xl border border-neutral-gray-100 p-spacing-lg shadow-sm">
              <div className="flex items-baseline justify-between text-sm font-semibold uppercase text-neutral-gray-500">
                <span>{level}</span>
                <span>{className.replace('text-', '')}</span>
              </div>
              <p className={`mt-spacing-sm font-extrabold text-neutral-dark ${className}`}>{sample}</p>
              <p className="mt-spacing-sm text-font-size-body text-neutral-gray-500">{usage}</p>
            </div>
          ))}
          {bodyStyles.map(({ label, className, usage }) => (
            <div key={label} className="rounded-2xl border border-neutral-gray-100 p-spacing-lg shadow-sm">
              <div className="flex items-baseline justify-between text-sm font-semibold uppercase text-neutral-gray-500">
                <span>{label}</span>
                <span>{className.replace('text-', '')}</span>
              </div>
              <p className={`mt-spacing-sm text-neutral-dark ${className}`}>
                Mister DJ levert full-service entertainment met persoonlijke begeleiding van intake tot aftermovie.
              </p>
              <p className="mt-spacing-sm text-font-size-body text-neutral-gray-500">{usage}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="space-y-spacing-lg">
        <h3 className="text-font-size-h3 font-bold text-primary">Gebruik & Pairing</h3>
        <div className="rounded-3xl border border-primary/20 bg-primary/5 p-spacing-xl text-neutral-dark shadow-lg">
          <p className="text-font-size-h3 font-semibold">Primary Font</p>
          <p className="text-font-size-body text-neutral-dark/80">
            Montserrat, sans-serif — bold voor titels, semi-bold voor subkoppen en regular voor body. Combineer met voldoende
            whitespace voor ademruimte en consistent gebruik van onze kleur tokens voor optimale leesbaarheid.
          </p>
          <ul className="mt-spacing-lg space-y-spacing-sm text-font-size-body text-neutral-dark/80">
            <li><strong>Line-height:</strong> 1.4 voor headings, 1.6 voor body copy.</li>
            <li><strong>Letterspacing:</strong> Gebruik uppercase tracking voor badges en navigatie-items.</li>
            <li><strong>Responsive:</strong> Schaal headings terug op mobile (-8px) voor optimale hiërarchie.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-md">
          <h4 className="text-font-size-h3 font-semibold text-neutral-dark">Tone of Voice</h4>
          <p className="mt-spacing-sm text-font-size-body text-neutral-gray-500">
            Energiek, professioneel en persoonlijk. Gebruik actieve zinnen, spreek de lezer aan en benadruk vertrouwen met
            concrete cijfers (reviews, jaren ervaring) om zowel SEO als conversie te versterken.
          </p>
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default TypographySystem;
