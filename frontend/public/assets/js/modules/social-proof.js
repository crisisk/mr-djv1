import { prepareRevealElement } from './reveal.js';

const loadTestimonials = async () => {
  const response = await fetch('/assets/data/testimonials.json', { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error('Kon testimonials niet laden');
  return response.json();
};

const createCard = (testimonial) => {
  const isVideo = testimonial.media?.type === 'video';
  const mediaContent = isVideo
    ? `<video controls preload="metadata" poster="${testimonial.media?.poster || ''}" loading="lazy">
         <source src="${testimonial.media?.src}" type="video/mp4">
         Je browser ondersteunt geen video playback.
       </video>`
    : `<img src="${testimonial.media?.src}" alt="${testimonial.media?.alt || 'Mister DJ review'}" loading="lazy" decoding="async" />`;

  return `
  <article class="social-proof-card" data-testimonial-id="${testimonial.id}" data-category="${testimonial.category}">
    <figure class="social-proof-media">
      ${mediaContent}
    </figure>
    <div class="social-proof-content">
      <div class="social-proof-meta">
        <span class="rating" aria-label="${testimonial.rating} sterren">${'★'.repeat(testimonial.rating)}</span>
        <span>${testimonial.eventType} • ${testimonial.city}</span>
        <span>${testimonial.eventDate}</span>
      </div>
      <p class="social-proof-quote">"${testimonial.quote}"</p>
      <p class="social-proof-author">${testimonial.name}</p>
      <button class="btn-link social-proof-cta" type="button" data-gallery="${testimonial.media?.src}">Bekijk ${isVideo ? 'video' : 'moment'}</button>
    </div>
  </article>
`;};

export const initSocialProof = async (analytics) => {
  const container = document.getElementById('featured-reviews');
  if (!container) return;

  try {
    const testimonials = await loadTestimonials();
    const bruiloft = testimonials.filter((item) => item.category === 'bruiloft').slice(0, 3);
    const bedrijfsfeest = testimonials.filter((item) => item.category === 'bedrijfsfeest').slice(0, 3);

    if (!bruiloft.length && !bedrijfsfeest.length) {
      container.innerHTML = '<p class="loading">Testimonials worden bijgewerkt…</p>';
      return;
    }

    container.innerHTML = `
      <div class="social-proof-group">
        <header>
          <h3>Bruiloften 2023–2025</h3>
          <p>Actuele ervaringen van bruidsparen die Mister DJ kozen.</p>
        </header>
        <div class="social-proof-grid">${bruiloft.map(createCard).join('')}</div>
      </div>
      <div class="social-proof-group">
        <header>
          <h3>Bedrijfsfeesten met impact</h3>
          <p>Recent zakelijk succes met meetbare resultaten.</p>
        </header>
        <div class="social-proof-grid">${bedrijfsfeest.map(createCard).join('')}</div>
      </div>
    `;

    container.querySelectorAll('.social-proof-card').forEach((card) => {
      prepareRevealElement(card);
      if (analytics) {
        analytics.trackSocialProofImpression({
          testimonial_id: card.dataset.testimonialId,
          placement: 'featured_social_proof',
          category: card.dataset.category,
        });
      }
    });

    container.querySelectorAll('.social-proof-cta').forEach((cta) => {
      cta.addEventListener('click', () => {
        const gallerySrc = cta.dataset.gallery;
        if (analytics) {
          const card = cta.closest('.social-proof-card');
          analytics.trackSocialProofClick({
            testimonial_id: card?.dataset.testimonialId,
            category: card?.dataset.category,
            gallery_src: gallerySrc,
          });
        }
        const galleryImage = document.querySelector(`img[src="${gallerySrc}"]`);
        if (galleryImage) {
          galleryImage.scrollIntoView({ behavior: 'smooth', block: 'center' });
          galleryImage.classList.add('pulse');
          setTimeout(() => galleryImage.classList.remove('pulse'), 1200);
        }
      });
    });
  } catch (error) {
    console.error('Social proof laden mislukt', error);
    container.innerHTML = '<p class="loading">Kon testimonials niet laden.</p>';
  }
};
