import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';

const colorGroups = [
  {
    title: 'Merk Kleuren',
    colors: [
      {
        name: 'Primary Blue',
        hex: '#00AEEF',
        usage: "CTA's, highlights, iconografie",
        textColor: 'text-neutral-light',
      },
      {
        name: 'Secondary Gold',
        hex: '#D4AF37',
        usage: 'Accenten, premium badges, ratings',
        textColor: 'text-neutral-dark',
      },
      {
        name: 'Deep Night',
        hex: '#1A2C4B',
        usage: 'Titels, body copy, donkere achtergronden',
        textColor: 'text-neutral-light',
      },
    ],
  },
  {
    title: 'Neutrale Kleuren',
    colors: [
      {
        name: 'Pure White',
        hex: '#FFFFFF',
        usage: 'Cards, panels, content achtergrond',
        textColor: 'text-neutral-dark',
        border: true,
      },
      {
        name: 'Sky Tint',
        hex: '#F8FCFF',
        usage: 'Secties, formulierachtergronden, dashboards',
        textColor: 'text-neutral-dark',
      },
      {
        name: 'Calm Divider',
        hex: '#E5E5E5',
        usage: 'Lijnen, borders, subtiele scheidingen',
        textColor: 'text-neutral-dark',
      },
    ],
  },
  {
    title: 'Functionele Kleuren',
    colors: [
      {
        name: 'Success',
        hex: '#4CAF50',
        usage: 'Bevestigingen, positieve meldingen, status badges',
        textColor: 'text-neutral-light',
      },
      {
        name: 'Warning',
        hex: '#FFC107',
        usage: 'Attentie, waarschuwingen, reminder banners',
        textColor: 'text-neutral-dark',
      },
      {
        name: 'Error',
        hex: '#FF4D4D',
        usage: 'Foutmeldingen, kritieke alerts, validaties',
        textColor: 'text-neutral-light',
      },
    ],
  },
];

const ColorSwatch = ({ name, hex, usage, textColor, border }) => (
  <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-gray-100 shadow-md">
    <div
      className={`flex h-28 items-end justify-start rounded-b-none px-spacing-md pb-spacing-sm text-font-size-body font-semibold ${textColor}`}
      style={{ backgroundColor: hex, border: border ? '1px solid #E5E5E5' : undefined }}
    >
      {name}
    </div>
    <div className="space-y-spacing-xs bg-neutral-light px-spacing-md py-spacing-sm text-sm text-neutral-dark">
      <p className="font-semibold uppercase tracking-wide text-neutral-gray-500">{hex}</p>
      <p className="text-neutral-gray-500">{usage}</p>
    </div>
  </div>
);

const ColorSystem = () => (
  <SlideLayout
    title="Atoms: Color System"
    subtitle="Het officiële kleurenpalet voor Mister DJ met merk-, neutrale en functionele varianten."
  >
    <div className="grid gap-spacing-xl md:grid-cols-3">
      {colorGroups.map((group) => (
        <div key={group.title} className="flex flex-col gap-spacing-md">
          <h3 className="text-font-size-h3 font-bold text-primary">{group.title}</h3>
          <div className="flex flex-col gap-spacing-md">
            {group.colors.map((color) => (
              <ColorSwatch key={color.name} {...color} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </SlideLayout>
);

export default ColorSystem;
