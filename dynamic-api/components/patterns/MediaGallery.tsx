'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import OptimizedImage from '../ui/OptimizedImage';
import { galleryCard, staggerContainer, staggerItem } from '@/lib/animations';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MediaItem {
  id: string;
  src: string;
  alt: string;
  label?: string;
  type?: 'image' | 'video';
}

interface MediaGalleryProps {
  items: MediaItem[];
  layout?: 'grid' | 'carousel';
  columns?: 2 | 3 | 4;
  showLabels?: boolean;
  className?: string;
}

export default function MediaGallery({
  items,
  layout = 'grid',
  columns = 3,
  showLabels = true,
  className = ''
}: MediaGalleryProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'start' });

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  if (layout === 'carousel') {
    return (
      <div className={`relative ${className}`}>
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex gap-spacing-md">
            {items.map((item) => (
              <motion.div
                key={item.id}
                className="relative flex-[0_0_85%] md:flex-[0_0_45%] lg:flex-[0_0_30%]"
                {...galleryCard}
              >
                <div className="group relative h-64 overflow-hidden rounded-3xl border border-neutral-gray-100 bg-neutral-dark/80 shadow-lg">
                  <OptimizedImage
                    src={item.src}
                    alt={item.alt}
                    fill
                    objectFit="cover"
                    className="transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-dark/70 to-transparent" />
                  {showLabels && item.label && (
                    <div className="absolute bottom-spacing-md left-spacing-md text-sm font-semibold text-neutral-light">
                      {item.label}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <button
          onClick={scrollPrev}
          className="absolute left-spacing-md top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-spacing-sm shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
          aria-label="Previous"
        >
          <ChevronLeft className="h-6 w-6 text-neutral-dark" />
        </button>
        <button
          onClick={scrollNext}
          className="absolute right-spacing-md top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-spacing-sm shadow-lg backdrop-blur-sm transition-all hover:bg-white hover:shadow-xl"
          aria-label="Next"
        >
          <ChevronRight className="h-6 w-6 text-neutral-dark" />
        </button>
      </div>
    );
  }

  // Grid layout
  const gridClass = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-2 lg:grid-cols-3',
    4: 'md:grid-cols-2 lg:grid-cols-4'
  }[columns];

  return (
    <motion.div
      className={`grid gap-spacing-md ${gridClass} ${className}`}
      variants={staggerContainer}
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-100px' }}
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          variants={staggerItem}
          whileHover={{ scale: 1.05, boxShadow: '0 14px 30px rgba(16, 24, 40, 0.15)' }}
          transition={{ duration: 0.3 }}
        >
          <div className="group relative h-64 overflow-hidden rounded-3xl border border-neutral-gray-100 bg-neutral-dark/80 shadow-lg transition-shadow">
            <OptimizedImage
              src={item.src}
              alt={item.alt}
              fill
              objectFit="cover"
              className="transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-dark/70 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            {showLabels && item.label && (
              <div className="absolute bottom-spacing-md left-spacing-md text-sm font-semibold text-neutral-light opacity-0 transition-opacity group-hover:opacity-100">
                {item.label}
              </div>
            )}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
