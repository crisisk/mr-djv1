import type { Meta, StoryObj } from '@storybook/react';
import { PricingTables, type PricingFeatureSet } from './PricingTables';

const meta: Meta<typeof PricingTables> = {
  title: 'Sections/PricingTables',
  component: PricingTables,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof PricingTables>;

export const Default: Story = {};

const startupPackages: PricingFeatureSet[] = [
  {
    name: 'Starter',
    subtitle: 'Ideaal voor intieme events',
    price: '€395',
    features: ['3 uur DJ-set', 'Compacte lichtshow', 'Voorafgaand intakegesprek'],
    buttonText: 'Ontdek meer',
  },
  {
    name: 'Plus',
    subtitle: 'Populairste keuze voor bruiloften',
    price: '€695',
    features: ['6 uur DJ-set', 'Uitgebreide licht- en geluidsset', 'Ceremonie muziek', 'DJ + saxofonist'],
    isFeatured: true,
    buttonText: 'Boek nu',
  },
  {
    name: 'Pro',
    subtitle: 'Voor grootschalige evenementen',
    price: '€1.095',
    features: ['8 uur DJ-set', 'Premium lichtshow', 'MC & live artiest', 'Afterparty mix'],
    buttonText: 'Vraag offerte',
  },
];

export const CustomPackages: Story = {
  args: {
    packages: startupPackages,
  },
};
