import React from 'react';

// --- Interfaces ---

interface ColorSwatchProps {
  name: string;
  hex: string;
  usage: string;
  textColor: 'text-neutral-light' | 'text-neutral-dark';
  border?: boolean;
}

interface ColorDefinition extends ColorSwatchProps {
  border?: boolean;
}

interface ColorGroup {
  title: string;
  colors: ColorDefinition[];
}

// --- Data ---

const colorGroups: ColorGroup[] = [
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

// --- Components ---

const ColorSwatch: React.FC<ColorSwatchProps> = ({ name, hex, usage, textColor, border }) => (
  <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 shadow-md" aria-label={`Kleur: ${name}`}>
    <div
      className={`flex h-28 items-end justify-start rounded-t-lg px-spacing-md pb-spacing-sm text-lg font-semibold ${textColor}`}
      style={{
        backgroundColor: hex,
        border: border ? '1px solid #E5E5E5' : undefined,
        // Ensure text contrast is handled by textColor prop
      }}
    >
      {name}
    </div>
    <div className="space-y-spacing-xs bg-white px-spacing-md py-spacing-sm text-sm text-gray-700">
      <p className="font-semibold uppercase tracking-wide text-gray-500">{hex}</p>
      <p className="text-gray-600">{usage}</p>
    </div>
  </div>
);

const ColorSystem: React.FC = () => (
  <div className="p-spacing-lg">
    <header className="mb-spacing-xl">
      <h1 className="text-4xl font-extrabold text-deep-night">Atoms: Color System</h1>
      <p className="mt-spacing-sm text-xl text-gray-600">
        Het officiële kleurenpalet voor Mister DJ met merk-, neutrale en functionele varianten.
      </p>
    </header>

    <div className="grid gap-spacing-xl md:grid-cols-3">
      {colorGroups.map((group) => (
        <section key={group.title} className="flex flex-col gap-spacing-md">
          <h2 className="text-2xl font-bold text-primary">{group.title}</h2>
          <div className="flex flex-col gap-spacing-md">
            {group.colors.map((color) => (
              <ColorSwatch
                key={color.name}
                name={color.name}
                hex={color.hex}
                usage={color.usage}
                textColor={color.textColor}
                border={color.border}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  </div>
);

export default ColorSystem;