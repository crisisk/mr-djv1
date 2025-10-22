import type { Meta, StoryObj } from "@storybook/react";
import { Testimonials, type TestimonialEntry } from "./Testimonials";

const meta: Meta<typeof Testimonials> = {
  title: "Sections/Testimonials",
  component: Testimonials,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof Testimonials>;

export const Default: Story = {};

const winterTestimonials: TestimonialEntry[] = [
  {
    quote: "Het wintergala was magisch. De DJ voelde perfect aan wat de dansvloer nodig had.",
    author: "Lotte & Sven",
    source: "Winterbruiloft, Delft",
    rating: 5,
  },
  {
    quote:
      "Professionele voorbereiding en een spectaculaire uitvoering. We boeken ze volgend jaar weer!",
    author: "Johan Vermeer",
    source: "Nieuwjaarsfeest, Rotterdam",
    rating: 4,
  },
  {
    quote: "Van intake tot laatste plaat: alles klopte en onze gasten praten er nog over.",
    author: "Sanne de Groot",
    source: "Bedrijfsevent, Haarlem",
    rating: 5,
  },
];

export const WinterEvents: Story = {
  args: {
    testimonials: winterTestimonials,
  },
};
