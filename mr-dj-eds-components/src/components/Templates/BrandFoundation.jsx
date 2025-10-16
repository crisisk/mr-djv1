import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';

const colors = [
  { name: 'Deep Navy', hex: '#1A2C4B' },
  { name: 'Bright Blue', hex: '#00AEEF' },
  { name: 'Gold', hex: '#D4AF37' },
  { name: 'Pure White', hex: '#FFFFFF', border: true },
];

const typography = [
  { label: 'Hero H1', description: 'Montserrat 900 / 48px / -2% tracking', usage: 'Home hero, product hero' },
  { label: 'Section H2', description: 'Montserrat 700 / 36px', usage: 'Belangrijke secties, landingspagina’s' },
  { label: 'Body', description: 'Montserrat 500 / 16px', usage: 'Lange teksten, formulier copy' },
];

const spacing = [
  { token: 'Spacing 16', value: '16px', usage: 'Body copy, component padding' },
  { token: 'Spacing 24', value: '24px', usage: 'Card padding, horizontaal ritme' },
  { token: 'Spacing 48', value: '48px', usage: 'Secties desktop' },
];

const BrandFoundation = () => (
  <SlideLayout
    title="Brand Foundation"
    subtitle="Design tokens voor kleur, typografie en spacing vormen de basis van elke Mister DJ ervaring."
  >
    <div className="grid gap-spacing-xl md:grid-cols-3">
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Kleur</h3>
        <div className="grid gap-spacing-md">
          {colors.map((color) => (
            <div key={color.name} className="flex items-center gap-spacing-md rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-md shadow-sm">
              <div
                className="size-16 rounded-2xl border border-neutral-gray-100"
                style={{ backgroundColor: color.hex, borderColor: color.border ? '#E5E5E5' : 'transparent' }}
              />
              <div>
                <p className="text-sm font-semibold text-neutral-dark">{color.name}</p>
                <p className="text-xs text-neutral-gray-500">{color.hex}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Typografie</h3>
        <div className="space-y-spacing-md">
          {typography.map((item) => (
            <div key={item.label} className="rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-md shadow-sm">
              <p className="text-sm font-semibold text-primary">{item.label}</p>
              <p className="text-sm text-neutral-dark">{item.description}</p>
              <p className="text-xs text-neutral-gray-500">Gebruik: {item.usage}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Spacing</h3>
        <div className="space-y-spacing-sm">
          {spacing.map((item) => (
            <div key={item.token} className="flex items-center gap-spacing-md rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-md shadow-sm">
              <div className="h-3 flex-1 rounded-full bg-secondary/30">
                <div className="h-3 rounded-full bg-secondary" style={{ width: item.value === '16px' ? '30%' : item.value === '24px' ? '45%' : '80%' }} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-dark">{item.token}</p>
                <p className="text-xs text-neutral-gray-500">{item.value} – {item.usage}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  </SlideLayout>
);

export default BrandFoundation;
