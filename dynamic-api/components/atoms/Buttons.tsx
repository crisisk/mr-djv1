import React from 'react';
import { ArrowRight, CalendarCheck, Plus } from 'lucide-react';
import Button, { ButtonProps } from '../ui/Button';

// --- Type Definitions ---

interface ButtonSizeConfig {
  label: string;
  size: 'sm' | 'md' | 'lg';
}

interface VariantConfig {
  title: string;
  variant: 'primary' | 'secondary' | 'ghost';
  description: string;
}

// --- Configuration Data ---

const buttonSizes: ButtonSizeConfig[] = [
  { label: 'Small', size: 'sm' },
  { label: 'Medium', size: 'md' },
  { label: 'Large', size: 'lg' },
];

const variantConfig: VariantConfig[] = [
  {
    title: 'Primary',
    variant: 'primary',
    description: 'Hoofdcall-to-action voor conversies.',
  },
  {
    title: 'Secondary',
    variant: 'secondary',
    description: 'Gebruik voor secundaire acties of dashboards.',
  },
  {
    title: 'Ghost',
    variant: 'ghost',
    description: 'Subtle link-knoppen en tertiary actions.',
  },
];

// --- Component ---

const Buttons: React.FC = () => {
  return (
    <div className="p-spacing-xl">
      <header className="mb-spacing-xl space-y-spacing-sm">
        <h1 className="text-4xl font-bold text-text-primary">Atoms: Buttons</h1>
        <p className="text-lg text-neutral-gray-500">
          Interactiepatronen met duidelijk visueel gewicht en consistente focus states.
        </p>
      </header>

      <div className="grid gap-spacing-xl lg:grid-cols-[2fr,1fr]">
        {/* Main Content Area */}
        <div className="space-y-spacing-xl">
          {/* Variant Showcase */}
          {variantConfig.map(({ title, variant, description }) => (
            <section key={variant} className="space-y-spacing-md" aria-labelledby={`variant-${variant}`}>
              <div className="flex items-baseline justify-between">
                <h2 id={`variant-${variant}`} className="text-2xl font-semibold text-text-primary">
                  {title}
                </h2>
                <p className="text-sm text-neutral-gray-500">{description}</p>
              </div>
              <div className="flex flex-wrap gap-spacing-md p-spacing-sm rounded-lg bg-neutral-light/50 border border-neutral-gray-100">
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

          {/* Icon Showcase */}
          <section className="space-y-spacing-md" aria-labelledby="icon-buttons-heading">
            <h2 id="icon-buttons-heading" className="text-2xl font-semibold text-text-primary">
              Met Iconen
            </h2>
            <div className="flex flex-wrap gap-spacing-md p-spacing-sm rounded-lg bg-neutral-light/50 border border-neutral-gray-100">
              {/* Button with leading icon */}
              <Button variant="primary" size="lg" className="gap-spacing-sm">
                <CalendarCheck className="size-4" aria-hidden="true" />
                Check Beschikbaarheid
              </Button>

              {/* Button with trailing icon */}
              <Button variant="secondary" size="md" className="gap-spacing-sm">
                Meer info
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>

              {/* Small button with icon */}
              <Button variant="ghost" size="sm" className="gap-spacing-xs">
                <Plus className="size-4" aria-hidden="true" />
                Voeg add-on toe
              </Button>
            </div>
          </section>
        </div>

        {/* Sidebar/Aside */}
        <aside className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/80 p-spacing-xl shadow-lg h-fit">
          <h3 className="text-xl font-semibold text-text-primary mb-spacing-md">WCAG AA Accessibility</h3>
          <ul className="list-disc list-inside space-y-spacing-sm text-sm text-neutral-gray-700">
            <li><strong>Contrast:</strong> Alle varianten voldoen aan AA contrast (min 4.5:1).</li>
            <li><strong>Focus State:</strong> Duidelijke focus ringen (keyboard navigatie).</li>
            <li><strong>Semantiek:</strong> Gebruik van native &lt;button&gt; elementen.</li>
            <li><strong>Iconen:</strong> Decoratieve iconen hebben <code>aria-hidden=&quot;true&quot;</code>.</li>
          </ul>
        </aside>
      </div>
    </div>
  );
};

export default Buttons;