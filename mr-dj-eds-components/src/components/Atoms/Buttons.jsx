import React from 'react';
import { ArrowRight, CalendarCheck, Plus } from 'lucide-react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';

const buttonSizes = [
  { label: 'Small', size: 'sm' },
  { label: 'Medium', size: 'default' },
  { label: 'Large', size: 'lg' },
];

const variantConfig = [
  {
    title: 'Primary',
    variant: 'default',
    description: 'Hoofdcall-to-action voor conversies.',
  },
  {
    title: 'Secondary',
    variant: 'secondary',
    description: 'Gebruik voor secundaire acties of dashboards.',
  },
  {
    title: 'Outline',
    variant: 'outline',
    description: 'Transparante CTA’s op donkere achtergronden.',
  },
  {
    title: 'Ghost',
    variant: 'ghost',
    description: 'Subtle link-knoppen en tertiary actions.',
  },
];

const Buttons = () => (
  <SlideLayout
    title="Atoms: Buttons"
    subtitle="Interactiepatronen met duidelijk visueel gewicht en consistente focus states."
  >
    <div className="grid gap-spacing-xl lg:grid-cols-[2fr,1fr]">
      <div className="space-y-spacing-xl">
        {variantConfig.map(({ title, variant, description }) => (
          <section key={variant} className="space-y-spacing-sm">
            <div className="flex items-baseline justify-between">
              <h3 className="text-font-size-h3 font-semibold text-neutral-dark">{title}</h3>
              <span className="text-sm text-neutral-gray-500">{description}</span>
            </div>
            <div className="flex flex-wrap gap-spacing-sm">
              {buttonSizes.map(({ label, size }) => (
                <div key={`${variant}-${size}`} className="flex flex-col items-center gap-spacing-xs">
                  <Button variant={variant} size={size}>
                    {title} {label}
                  </Button>
                  <span className="text-xs uppercase tracking-wide text-neutral-gray-500">{label}</span>
                </div>
              ))}
            </div>
          </section>
        ))}

        <section className="space-y-spacing-sm">
          <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Met Iconen</h3>
          <div className="flex flex-wrap gap-spacing-sm">
            <Button variant="default" size="lg" className="gap-spacing-sm">
              <CalendarCheck className="size-4" aria-hidden />
              Check Beschikbaarheid
            </Button>
            <Button variant="outline" size="default" className="gap-spacing-sm">
              Meer info
              <ArrowRight className="size-4" aria-hidden />
            </Button>
            <Button variant="secondary" size="sm" className="gap-spacing-xs">
              <Plus className="size-4" aria-hidden />
              Voeg add-on toe
            </Button>
          </div>
        </section>
      </div>

      <aside className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/80 p-spacing-xl shadow-lg">
        <h4 className="text-font-size-h3 font-semibold text-neutral-dark">Design Richtlijnen</h4>
        <ul className="mt-spacing-md space-y-spacing-sm text-sm text-neutral-gray-500">
          <li><strong>Focus states:</strong> Altijd een ring met merkcontrast voor toetsenbordgebruikers.</li>
          <li><strong>Spacing:</strong> Gebruik spacing tokens (px-4/6) voor consistente ritmes.</li>
          <li><strong>Disabled:</strong> Verlaag opacity naar 50% maar behoud leesbaarheid van de labeltekst.</li>
          <li><strong>Responsive:</strong> Volle breedte op mobile in formulieren voor optimale tappability.</li>
        </ul>
      </aside>
    </div>
  </SlideLayout>
);

export default Buttons;
