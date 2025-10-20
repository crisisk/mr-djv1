import type { Meta, StoryObj } from '@storybook/react';
import { HeroSection } from './HeroSection';

const meta: Meta<typeof HeroSection> = {
  title: 'Sections/HeroSection',
  component: HeroSection,
  tags: ['autodocs'],
  args: {
    title: 'Boek de ultieme bruiloft DJ',
    subtitle:
      'Laat uw gasten genieten van een onvergetelijke avond vol energie, live sax en een feest dat nog lang zal nazinderen.',
    ctaPrimaryText: 'Bekijk beschikbaarheid',
    ctaSecondaryText: 'Vraag offerte aan',
  },
};

export default meta;

type Story = StoryObj<typeof HeroSection>;

export const Default: Story = {};

export const WithoutSecondaryCta: Story = {
  args: {
    ctaSecondaryText: undefined,
  },
};

export const CustomBackground: Story = {
  args: {
    backgroundClass: 'bg-gradient-to-r from-primary to-secondary',
    titleColor: 'text-neutral-light',
    subtitleColor: 'text-neutral-light/80',
  },
};
