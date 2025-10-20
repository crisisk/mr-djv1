import React, { useEffect, useRef } from 'react';
import styles from './OrganismsGallery.module.css';

type GridItem = {
  id: string;
  label: string;
  alt: string;
  src: string;
};

type CarouselItem =
  | ({ type: 'image' } & GridItem)
  | ({ type: 'video'; poster: string } & GridItem);

const gridImages: GridItem[] = [
  {
    id: 'grid-image-1',
    label: 'Image 1',
    alt: 'Event highlight 1',
    src: 'https://via.placeholder.com/300x300.png?text=Image+1',
  },
  {
    id: 'grid-image-2',
    label: 'Image 2',
    alt: 'Event highlight 2',
    src: 'https://via.placeholder.com/300x300.png?text=Image+2',
  },
  {
    id: 'grid-image-3',
    label: 'Image 3',
    alt: 'Event highlight 3',
    src: 'https://via.placeholder.com/300x300.png?text=Image+3',
  },
  {
    id: 'grid-image-4',
    label: 'Image 4',
    alt: 'Event highlight 4',
    src: 'https://via.placeholder.com/300x300.png?text=Image+4',
  },
  {
    id: 'grid-image-5',
    label: 'Image 5',
    alt: 'Event highlight 5',
    src: 'https://via.placeholder.com/300x300.png?text=Image+5',
  },
  {
    id: 'grid-image-6',
    label: 'Image 6',
    alt: 'Event highlight 6',
    src: 'https://via.placeholder.com/300x300.png?text=Image+6',
  },
  {
    id: 'grid-image-7',
    label: 'Image 7',
    alt: 'Event highlight 7',
    src: 'https://via.placeholder.com/300x300.png?text=Image+7',
  },
  {
    id: 'grid-image-8',
    label: 'Image 8',
    alt: 'Event highlight 8',
    src: 'https://via.placeholder.com/300x300.png?text=Image+8',
  },
  {
    id: 'grid-image-9',
    label: 'Image 9',
    alt: 'Event highlight 9',
    src: 'https://via.placeholder.com/300x300.png?text=Image+9',
  },
];

const carouselItems: CarouselItem[] = [
  {
    id: 'carousel-video-1',
    type: 'video',
    label: 'Video Item 1',
    alt: 'Video item 1 thumbnail',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://via.placeholder.com/400x225.png?text=Video+1',
  },
  {
    id: 'carousel-image-2',
    type: 'image',
    label: 'Image Item 2',
    alt: 'Carousel highlight 2',
    src: 'https://via.placeholder.com/400x225.png?text=Image+2',
  },
  {
    id: 'carousel-image-3',
    type: 'image',
    label: 'Image Item 3',
    alt: 'Carousel highlight 3',
    src: 'https://via.placeholder.com/400x225.png?text=Image+3',
  },
  {
    id: 'carousel-video-4',
    type: 'video',
    label: 'Video Item 4',
    alt: 'Video item 4 thumbnail',
    src: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    poster: 'https://via.placeholder.com/400x225.png?text=Video+4',
  },
  {
    id: 'carousel-image-5',
    type: 'image',
    label: 'Image Item 5',
    alt: 'Carousel highlight 5',
    src: 'https://via.placeholder.com/400x225.png?text=Image+5',
  },
];

const OrganismsGallery: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const videos = Array.from(
      container.querySelectorAll<HTMLVideoElement>('video[data-autoplay="true"]')
    );

    if (videos.length === 0) {
      return;
    }

    const playVideo = (video: HTMLVideoElement) => {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          // Ignore autoplay errors (e.g. user interaction required)
        });
      }
    };

    if (!('IntersectionObserver' in window)) {
      videos.forEach(playVideo);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            playVideo(video);
          } else {
            video.pause();
            video.currentTime = 0;
          }
        });
      },
      { threshold: 0.5 }
    );

    videos.forEach((video) => observer.observe(video));

    return () => {
      videos.forEach((video) => observer.unobserve(video));
      observer.disconnect();
    };
  }, []);

  return (
    <div className={styles.slideContainer} ref={containerRef}>
      <h1>Organisms: Media Galleries</h1>
      <p className={styles.subtitle}>
        Componenten voor het tonen van foto's en video's van evenementen (Grid, Carousel, Lightbox)
      </p>

      <div className={styles.galleryContainer}>
        <section className={styles.gallerySection} aria-label="Masonry Grid Gallery">
          <h2 className={styles.galleryTitle}>Masonry Grid Gallery (4x4)</h2>
          <div className={styles.gridGallery}>
            <div className={`${styles.gridItem} ${styles.featured}`}>
              <video
                className={styles.media}
                data-autoplay="true"
                muted
                playsInline
                loop
                preload="none"
                poster="https://via.placeholder.com/640x360.png?text=Featured+Video"
              >
                <source
                  src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
              <span className={styles.mediaLabel}>Featured Video (16:9)</span>
            </div>
            {gridImages.map((item) => (
              <div key={item.id} className={`${styles.gridItem} ${styles.imagePlaceholder}`}>
                <img
                  className={styles.media}
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                />
                <span className={`${styles.mediaLabel} ${styles.imageLabel}`}>{item.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className={styles.gallerySection} aria-label="Full-Width Carousel">
          <h2 className={styles.galleryTitle}>Full-Width Carousel (Auto-Play)</h2>
          <div className={styles.carouselGallery}>
            {carouselItems.map((item) => (
              <div
                key={item.id}
                className={`${styles.carouselItem} ${item.type === 'video' ? styles.videoPlaceholder : styles.imagePlaceholder}`}
              >
                {item.type === 'video' ? (
                  <video
                    className={styles.media}
                    data-autoplay="true"
                    muted
                    playsInline
                    loop
                    preload="none"
                    poster={item.poster}
                  >
                    <source src={item.src} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <img
                    className={styles.media}
                    src={item.src}
                    alt={item.alt}
                    loading="lazy"
                  />
                )}
                <span className={`${styles.mediaLabel} ${item.type === 'image' ? styles.imageLabel : ''}`}>
                  {item.label}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.carouselControls} aria-hidden="true">
            <button className={styles.controlButton} type="button" aria-label="Previous item">
              &lt;
            </button>
            <button className={styles.controlButton} type="button" aria-label="Next item">
              &gt;
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default OrganismsGallery;
