const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_KEYS = {
  packages: 'misterdj.packages.v2',
  reviews: 'misterdj.reviews.v2',
};

const safeStorage = (() => {
  try {
    const testKey = '__misterdj_test__';
    window.sessionStorage.setItem(testKey, '1');
    window.sessionStorage.removeItem(testKey);
    return window.sessionStorage;
  } catch (error) {
    console.warn('SessionStorage niet beschikbaar, caching uitgeschakeld.', error);
    return null;
  }
})();

const readCache = (key) => {
  if (!safeStorage) return null;
  try {
    const raw = safeStorage.getItem(key);
    if (!raw) return null;
    const payload = JSON.parse(raw);
    if (!payload.expiresAt || payload.expiresAt < Date.now()) {
      safeStorage.removeItem(key);
      return null;
    }
    return payload.value;
  } catch (error) {
    console.warn('Kon cache niet lezen:', error);
    return null;
  }
};

const writeCache = (key, value, ttl = CACHE_TTL_MS) => {
  if (!safeStorage) return;
  try {
    safeStorage.setItem(
      key,
      JSON.stringify({
        expiresAt: Date.now() + ttl,
        value,
      })
    );
  } catch (error) {
    console.warn('Kon cache niet opslaan:', error);
  }
};

const fetchJson = async (url) => {
  const response = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!response.ok) throw new Error(`Request mislukt: ${url}`);
  return response.json();
};

const renderPackages = (packages, analytics) => {
  const container = document.getElementById('packages-container');
  if (!container) return;

  if (!packages.length) {
    container.innerHTML = '<p class="loading">Geen pakketten beschikbaar</p>';
    return;
  }

  container.innerHTML = packages
    .map((pkg) => {
      const features = Array.isArray(pkg.features) ? pkg.features : [];
      const upsells = Array.isArray(pkg.upsells) ? pkg.upsells : [];
      const popularClass = pkg.popular ? 'popular' : '';
      return `
        <article class="package-card ${popularClass}" data-package-id="${pkg.id || ''}" data-package-name="${pkg.name}">
          <div class="package-header">
            <h3 class="package-name">${pkg.name}</h3>
            <div class="package-price" aria-label="Prijs">€${pkg.price}</div>
            ${pkg.duration ? `<div class="package-duration">${pkg.duration}</div>` : ''}
          </div>
          ${pkg.description ? `<p class="package-description">${pkg.description}</p>` : ''}
          <ul class="package-features">
            ${features.map((feature) => `<li>✓ ${feature}</li>`).join('')}
          </ul>
          ${
            upsells.length
              ? `<div class="package-upsells"><p class="upsell-label">Populaire uitbreidingen</p><ul>${upsells
                  .map((addOn) => `<li data-upsell-id="${addOn.id}">${addOn.name} <span>+€${addOn.price}</span></li>`)
                  .join('')}</ul></div>`
              : ''
          }
          <a href="#contact" class="btn-primary package-cta" data-package-id="${pkg.id || ''}" style="width: 100%; text-align: center;">Boek nu</a>
        </article>
      `;
    })
    .join('');

  container.querySelectorAll('.package-card').forEach((card) => {
    card.addEventListener('mouseenter', () => {
      if (analytics) {
        analytics.trackPackageView({
          package_id: card.dataset.packageId,
          package_name: card.dataset.packageName,
        });
      }
    }, { once: true });
  });

  container.querySelectorAll('.package-cta').forEach((cta) => {
    cta.addEventListener('click', () => {
      if (analytics) {
        analytics.trackPackageCTA({
          package_id: cta.dataset.packageId,
          package_name: cta.closest('.package-card')?.dataset.packageName,
        });
      }
    });
  });
};

const renderReviews = (reviews, analytics) => {
  const container = document.getElementById('reviews-container');
  if (!container) return;

  if (!reviews.length) {
    container.innerHTML = '<p class="loading">Geen reviews beschikbaar</p>';
    return;
  }

  container.innerHTML = reviews
    .map(
      (review) => `
        <article class="review-card" data-review-id="${review.id || ''}">
          <div class="review-stars" aria-label="Beoordeling">${'⭐'.repeat(Math.round(review.rating || 5))}</div>
          <p class="review-text">"${review.reviewText || review.text || review.quote}"</p>
          <div class="review-author">
            <strong>${review.name || review.author}</strong>
            <span>${review.eventType || review.event_type || ''}</span>
          </div>
        </article>
      `
    )
    .join('');

  if (analytics) {
    container.querySelectorAll('.review-card').forEach((card) => {
      analytics.trackSocialProofImpression({
        testimonial_id: card.dataset.reviewId,
        placement: 'reviews_section',
      });
    });
  }
};

const highlightRecommendedPackage = (packageName) => {
  const cards = document.querySelectorAll('#packages-container .package-card');
  cards.forEach((card) => {
    const cardName = (card.getAttribute('data-package-name') || '').toLowerCase();
    const isMatch = packageName && cardName === packageName.toLowerCase();
    card.classList.toggle('recommended', Boolean(isMatch));
  });
};

export const initPackageSection = async (analytics) => {
  const container = document.getElementById('packages-container');
  if (!container) return;

  const cached = readCache(CACHE_KEYS.packages);
  if (cached) {
    renderPackages(cached, analytics);
  }

  try {
    const apiPayload = await fetchJson('/api/packages');
    const packages =
      apiPayload?.success && Array.isArray(apiPayload?.data?.packages) && apiPayload.data.packages.length
        ? apiPayload.data.packages
        : null;
    if (packages) {
      renderPackages(packages, analytics);
      writeCache(CACHE_KEYS.packages, packages);
      return;
    }
  } catch (error) {
    console.warn('API pakketten niet beschikbaar, val terug op statische data.', error);
  }

  try {
    const fallback = await fetchJson('/assets/data/packages.json');
    renderPackages(fallback, analytics);
    writeCache(CACHE_KEYS.packages, fallback);
  } catch (error) {
    console.error('Kon statische pakketten niet laden.', error);
    renderPackages([], analytics);
  }
};

export const initReviewSection = async (analytics) => {
  const container = document.getElementById('reviews-container');
  if (!container) return;

  const cached = readCache(CACHE_KEYS.reviews);
  if (cached) {
    renderReviews(cached, analytics);
  }

  try {
    const apiPayload = await fetchJson('/api/reviews');
    const reviews =
      apiPayload?.success && Array.isArray(apiPayload?.data?.reviews) && apiPayload.data.reviews.length
        ? apiPayload.data.reviews
        : null;
    if (reviews) {
      renderReviews(reviews, analytics);
      writeCache(CACHE_KEYS.reviews, reviews);
      return;
    }
  } catch (error) {
    console.warn('API reviews niet beschikbaar, val terug op statische data.', error);
  }

  try {
    const fallback = await fetchJson('/assets/data/testimonials.json');
    const formatted = fallback.map((review) => ({
      id: review.id,
      name: review.name,
      eventType: `${review.eventType} ${review.eventDate || ''}`.trim(),
      rating: review.rating,
      reviewText: review.quote,
    }));
    renderReviews(formatted, analytics);
    writeCache(CACHE_KEYS.reviews, formatted);
  } catch (error) {
    console.error('Kon statische reviews niet laden.', error);
    renderReviews([], analytics);
  }
};

document.addEventListener('persona:change', (event) => {
  highlightRecommendedPackage(event.detail?.recommended_package);
});
