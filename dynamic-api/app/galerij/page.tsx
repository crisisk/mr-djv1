'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import HeroSection from '../../components/organisms/HeroSection';
import Button from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';

type FilterType = 'alle' | 'bruiloft' | 'feest' | 'zakelijk';

export default function GalerijPage() {
  const [filter, setFilter] = useState<FilterType>('alle');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState('');

  // Generate all image paths
  const bruiloftImages = Array.from({ length: 21 }, (_, i) => ({
    src: `/media/optimized/webp/gallery/bruiloft-${String(i + 1).padStart(3, '0')}.webp`,
    category: 'bruiloft' as const,
    title: `Bruiloft ${i + 1}`
  }));

  const feestImages = Array.from({ length: 28 }, (_, i) => ({
    src: `/media/optimized/webp/gallery/feest-${String(i + 1).padStart(3, '0')}.webp`,
    category: 'feest' as const,
    title: `Feest ${i + 1}`
  }));

  // Mark some feest images as zakelijk for the filter
  const allImages = [
    ...bruiloftImages,
    ...feestImages.map((img, idx) => ({
      ...img,
      category: ([1, 2, 4, 5, 8, 9, 10, 12, 15, 18].includes(idx + 1) ? 'zakelijk' : 'feest') as 'feest' | 'zakelijk'
    }))
  ];

  const filteredImages = filter === 'alle'
    ? allImages
    : allImages.filter(img => img.category === filter);

  const openLightbox = (src: string) => {
    setLightboxImage(src);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setLightboxImage('');
  };

  return (
    <>
      {/* Hero Section */}
      <HeroSection
        eyebrow="Galerij"
        title="Bekijk Onze Mooiste Momenten"
        subtitle="Een impressie van de bruiloften, feesten en corporate events die wij hebben mogen verzorgen"
        ctaPrimaryText="Boek Nu"
        ctaSecondaryText="Neem Contact Op"
        ctaPrimaryHref="/contact"
        ctaSecondaryHref="/contact"
        backgroundClass="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50"
        titleColor="text-gray-900"
        subtitleColor="text-gray-700"
        badges={['2500+ Events', '49+ Foto\'s', '15 Jaar Ervaring']}
        socialProof="📸 Professionele foto's van onze beste momenten"
      />

      {/* Filter Tabs */}
      <section className="py-spacing-2xl px-spacing-xl bg-white sticky top-0 z-10 shadow-sm">
        <div className="container mx-auto">
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { key: 'alle' as const, label: 'Alle Foto\'s', count: allImages.length },
              { key: 'bruiloft' as const, label: 'Bruiloften', count: bruiloftImages.length },
              { key: 'feest' as const, label: 'Feesten', count: feestImages.filter((_, idx) => ![1, 2, 4, 5, 8, 9, 10, 12, 15, 18].includes(idx + 1)).length },
              { key: 'zakelijk' as const, label: 'Zakelijk', count: 10 }
            ].map((tab) => (
              <Button
                key={tab.key}
                variant={filter === tab.key ? 'primary' : 'secondary'}
                size="md"
                onClick={() => setFilter(tab.key)}
                className="min-w-[140px]"
              >
                {tab.label} ({tab.count})
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-spacing-3xl px-spacing-xl bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {filter === 'alle' && 'Alle Foto\'s'}
              {filter === 'bruiloft' && 'Bruiloft Foto\'s'}
              {filter === 'feest' && 'Feest Foto\'s'}
              {filter === 'zakelijk' && 'Zakelijke Events'}
            </h2>
            <p className="text-lg text-gray-600">
              {filteredImages.length} foto&apos;s
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image, idx) => (
              <div
                key={idx}
                className="relative h-64 rounded-lg overflow-hidden group cursor-pointer"
                onClick={() => openLightbox(image.src)}
              >
                <Image
                  src={image.src}
                  alt={image.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-white font-semibold text-lg block mb-2">
                      {image.title}
                    </span>
                    <span className="text-white/80 text-sm">
                      Klik om te vergroten
                    </span>
                  </div>
                </div>
                {/* Category Badge */}
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
                  {image.category === 'bruiloft' && '💍 Bruiloft'}
                  {image.category === 'feest' && '🎉 Feest'}
                  {image.category === 'zakelijk' && '💼 Zakelijk'}
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-600 text-lg">Geen foto&apos;s gevonden voor dit filter.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            onClick={closeLightbox}
            aria-label="Sluiten"
          >
            ×
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <Image
              src={lightboxImage}
              alt="Gallery image"
              fill
              className="object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {/* Gallery Info Section */}
      <section className="py-spacing-3xl px-spacing-xl bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Over Onze Foto&apos;s
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">📸</div>
              <h3 className="font-semibold text-xl mb-3">Professioneel</h3>
              <p className="text-gray-600">
                Alle foto&apos;s zijn gemaakt tijdens echte events door professionele fotografen
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">🎭</div>
              <h3 className="font-semibold text-xl mb-3">Authentiek</h3>
              <p className="text-gray-600">
                Geen geposeerde foto&apos;s, maar echte sfeerbeelden van onze events
              </p>
            </Card>

            <Card className="text-center p-spacing-lg">
              <div className="text-5xl mb-4">⭐</div>
              <h3 className="font-semibold text-xl mb-3">Inspiratie</h3>
              <p className="text-gray-600">
                Laat je inspireren voor je eigen event en zie wat mogelijk is
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-spacing-3xl px-spacing-xl bg-brand-gradient text-white">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            Wil Jij Ook In Onze Galerij?
          </h2>
          <p className="text-xl mb-8 opacity-95">
            Boek nu en word onderdeel van onze mooiste momenten
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-brand-600 hover:bg-gray-50"
              onClick={() => window.location.href = '/contact'}
            >
              Vraag offerte aan
            </Button>
            <Button
              size="lg"
              variant="ghost"
              className="border-2 border-white text-white hover:bg-white/10"
              onClick={() => window.location.href = '/pakketten'}
            >
              Bekijk pakketten
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
