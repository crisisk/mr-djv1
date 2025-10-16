import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';

const spacingScale = [
  { token: 'xs', value: '4px', description: 'Micro spacing – badges, icon padding' },
  { token: 'sm', value: '8px', description: 'Form labels, compacte componenten' },
  { token: 'md', value: '16px', description: 'Body copy, standaard componentafstanden' },
  { token: 'lg', value: '24px', description: 'Secties, kaarten, horizontale ritme' },
  { token: 'xl', value: '32px', description: 'Hero content, grid gutters mobile' },
  { token: '2xl', value: '48px', description: 'Section spacing desktop' },
  { token: '3xl', value: '64px', description: 'Hero en landing page blokken' },
];

const gridColumns = Array.from({ length: 12 }, (_, index) => index + 1);

const SpacingGrid = () => (
  <SlideLayout
    title="Atoms: Spacing & Grid"
    subtitle="8-punts spacing systeem gecombineerd met een 12-koloms layout voor responsive consistentie."
  >
    <div className="grid gap-spacing-xl md:grid-cols-2">
      <div className="space-y-spacing-lg">
        <h3 className="text-font-size-h3 font-bold text-primary">8pt Spacing Scale</h3>
        <ul className="space-y-spacing-md">
          {spacingScale.map(({ token, value, description }) => (
            <li key={token} className="flex items-center gap-spacing-md">
              <div className="w-20 text-sm font-semibold uppercase tracking-wide text-neutral-gray-500">{token}</div>
              <div className="h-3 flex-1 rounded-full bg-secondary/40">
                <div
                  className="h-3 rounded-full bg-secondary"
                  style={{ width: `${(parseInt(value, 10) / 64) * 100}%` }}
                />
              </div>
              <div className="text-sm font-semibold text-neutral-dark">{value}</div>
              <p className="text-sm text-neutral-gray-500">{description}</p>
            </li>
          ))}
        </ul>
      </div>
      <div className="space-y-spacing-lg">
        <h3 className="text-font-size-h3 font-bold text-primary">12 Koloms Grid</h3>
        <div className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
          <div className="grid grid-cols-12 gap-4">
            {gridColumns.map((col) => (
              <div
                key={col}
                className="flex h-24 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-xs font-semibold uppercase tracking-wide text-primary"
              >
                {col}
              </div>
            ))}
          </div>
          <div className="mt-spacing-lg grid gap-spacing-sm text-sm text-neutral-gray-500 md:grid-cols-2">
            <div><strong>Column width:</strong> fluid — afhankelijk van viewport</div>
            <div><strong>Gutter:</strong> 16px (mobile), 24px (desktop)</div>
            <div><strong>Max container:</strong> 1200px</div>
            <div><strong>Safe area:</strong> 32px padding mobile</div>
          </div>
        </div>
      </div>
    </div>
  </SlideLayout>
);

export default SpacingGrid;
