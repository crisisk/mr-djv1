import React from 'react';
import SlideLayout from '../common/SlideLayout.jsx';
import { Button } from '../ui/button.jsx';

const gridMedia = [
  { id: 1, label: 'Bruiloft • Eindhoven', image: '/images/gallery-1.jpg' },
  { id: 2, label: 'Corporate • Philips', image: '/images/gallery-2.jpg' },
  { id: 3, label: 'Festival • Breda', image: '/images/gallery-3.jpg' },
  { id: 4, label: 'Private event • Tilburg', image: '/images/gallery-4.jpg' },
];

const carouselSlides = [
  {
    title: 'Sfeerimpressie',
    description: 'Live mix van DJ + saxofonist tijdens bruiloft. Close-ups van interactie en dansvloer.',
  },
  {
    title: 'Corporate aftermovie',
    description: 'Highlights van een bedrijfsfeest met lichtshow, stage design en interviews.',
  },
  {
    title: 'Silent disco setup',
    description: 'Multikanaals silent disco met branding op hoofdtelefoons en verlichte booths.',
  },
];

const MediaGalleries = () => (
  <SlideLayout
    title="Organisms: Media Galleries"
    subtitle="Beeldcomponenten voor storytelling: image grids, carousels en video highlight-kaarten."
  >
    <div className="grid gap-spacing-xl lg:grid-cols-2">
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Event grid</h3>
        <div className="grid gap-spacing-md md:grid-cols-2">
          {gridMedia.map((item) => (
            <div
              key={item.id}
              className="relative h-48 overflow-hidden rounded-3xl border border-neutral-gray-100 bg-neutral-dark/80 text-neutral-light shadow-lg"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-dark/70 to-transparent" />
              <div className="absolute bottom-spacing-md left-spacing-md text-sm font-semibold">{item.label}</div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="lg" className="w-full">
          Bekijk volledige portfolio
        </Button>
      </section>
      <section className="space-y-spacing-md">
        <h3 className="text-font-size-h3 font-semibold text-neutral-dark">Carousel & video</h3>
        <div className="space-y-spacing-sm rounded-3xl border border-neutral-gray-100 bg-neutral-light/90 p-spacing-xl shadow-lg">
          {carouselSlides.map((slide, index) => (
            <div key={slide.title} className="flex items-start gap-spacing-md">
              <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                {index + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-dark">{slide.title}</p>
                <p className="text-sm text-neutral-gray-500">{slide.description}</p>
              </div>
            </div>
          ))}
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-spacing-md text-sm text-neutral-dark">
            Combineer video en foto’s in één component om sfeer, setup en klantquotes te tonen.
          </div>
        </div>
      </section>
    </div>
  </SlideLayout>
);

export default MediaGalleries;
