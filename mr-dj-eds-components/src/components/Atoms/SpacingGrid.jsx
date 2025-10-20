import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';

const spacingScale = [
  { token: 'xs', value: '8px', description: 'Micro spacing – badges, icon padding' },
  { token: 'sm', value: '16px', description: 'Form labels, compacte componenten' },
  { token: 'md', value: '24px', description: 'Body copy, standaard componentafstanden' },
  { token: 'lg', value: '32px', description: 'Secties, kaarten, horizontale ritme' },
  { token: 'xl', value: '40px', description: 'Hero content, grid gutters mobile' },
  { token: '2xl', value: '48px', description: 'Section spacing desktop' },
  { token: '3xl', value: '64px', description: 'Hero en landing page blokken' },
];

const gridDemo = [
  { label: '4 Kolommen', variant: 'span-4' },
  { label: '8 Kolommen', variant: 'span-8' },
  ...Array.from({ length: 12 }, (_, index) => ({
    label: '1',
    variant: 'single',
    key: `single-${index + 1}`,
  })),
];

const SpacingGrid = () => (
  <SlideLayout
    title="Atoms: Spacing & Grid"
    subtitle="8-punts spacing systeem gecombineerd met een 12-koloms layout voor responsive consistentie."
  >
    <div className="grid gap-spacing-xl md:grid-cols-2">
      <div className="space-y-spacing-lg">
        <h3 className="text-font-size-h3 font-bold text-primary">8-Punts Spacing Systeem</h3>
        <ul className="space-y-spacing-md">
          {spacingScale.map(({ label, px, value }) => (
            <li key={label} className="flex items-center gap-spacing-md">
              <div className="w-24 text-sm font-semibold text-neutral-dark">{label}</div>
              <div className="h-2 flex-1 rounded-full bg-secondary/30">
                <div className="h-2 rounded-full bg-secondary" style={{ width: `${px}px` }} />
              </div>
              <div className="text-sm font-semibold text-neutral-gray-500">{value}</div>
            </li>
          ))}
        </ul>
        <div className="space-y-spacing-sm rounded-2xl border border-neutral-gray-100 bg-neutral-light/80 p-spacing-md text-sm text-neutral-gray-600">
          <div><strong>Basis Eenheid:</strong> 8px</div>
          <div><strong>Regel:</strong> Alle afstanden moeten een veelvoud van 8 zijn (8, 16, 24, 32, 40, 48, etc.).</div>
          <div><strong>Voordeel:</strong> Zorgt voor verticale ritme en visuele harmonie.</div>
        </div>
      </div>
      <div className="space-y-spacing-lg">
        <h3 className="text-font-size-h3 font-bold text-primary">12-Koloms Grid Systeem</h3>
        <div className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
          <div className="grid grid-cols-12 gap-4">
            {gridDemo.map(({ label, variant, key }) => (
              <div
                key={key || `${variant}-${label}`}
                className={`flex h-24 items-center justify-center rounded-lg border text-xs font-semibold ${
                  variant === 'span-4'
                    ? 'col-span-4 border-secondary/80 bg-secondary/20 text-secondary'
                    : variant === 'span-8'
                    ? 'col-span-8 border-primary text-primary bg-primary/10'
                    : 'border-primary/30 bg-primary/5 text-primary'
                }`}
              >
                {label}
              </div>
            ))}
          </div>
          <div className="mt-spacing-lg grid gap-spacing-sm text-sm text-neutral-gray-500 md:grid-cols-2">
            <div><strong>Totaal Kolommen:</strong> 12</div>
            <div><strong>Gutter (Tussenruimte):</strong> 16px (Small Spacing)</div>
            <div><strong>Max Breedte:</strong> 1440px (Desktop)</div>
            <div><strong>Responsiviteit:</strong> Schakelt over naar 4 kolommen op mobiel.</div>
          </div>
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default SpacingGrid;
