const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_KEYS = {
  packages: 'misterdj.packages.v2',
  reviews: 'misterdj.reviews.v2',
};

const REVIEW_CATEGORY_ALIASES = {
  bruiloft: 'bruiloft',
  wedding: 'bruiloft',
  bedrijfsfeest: 'bedrijfsfeest',
  corporate: 'bedrijfsfeest',
  business: 'bedrijfsfeest',
  private: 'private',
  verjaardag: 'private',
  jubileum: 'private',
};

const REVIEW_FILTER_EVENT_MAP = {
  all: { persona: null, category: 'all' },
  bruiloft: {
    persona: 'bruiloft',
    category: 'bruiloft',
    event_type: 'bruiloft',
    recommended_package: 'Zilver Pakket',
  },
  bedrijfsfeest: {
    persona: 'bedrijfsfeest',
    category: 'bedrijfsfeest',
    event_type: 'bedrijfsfeest',
    recommended_package: 'Goud Pakket',
  },
  private: {
    persona: 'private',
    category: 'private',
    event_type: 'private event',
    recommended_package: 'Brons Pakket',
  },
};

const reviewState = {
  analytics: null,
  all: [],
  activeCategory: 'all',
  loaded: false,
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

const ensureReviewModerationStyles = () => {
  if (document.getElementById('review-moderation-styles')) return;

  const style = document.createElement('style');
  style.id = 'review-moderation-styles';
  style.textContent = `
    .review-status {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      margin-top: 0.75rem;
      padding: 0.15rem 0.65rem;
      border-radius: 999px;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.01em;
      text-transform: uppercase;
      background: rgba(255, 159, 28, 0.1);
      color: #c56f00;
    }

    .review-status::before {
      content: '';
      width: 0.45rem;
      height: 0.45rem;
      border-radius: 999px;
      background: currentColor;
      display: inline-block;
    }

    .review-status.review-status--pending {
      background: rgba(255, 159, 28, 0.18);
      color: #c56f00;
    }

    .review-status.review-status--approved {
      background: rgba(0, 176, 116, 0.12);
      color: #007a55;
    }
  `;
  document.head.appendChild(style);
};

const toCategorySlug = (value = '') => value.toString().trim().toLowerCase();

const normalizeCategoryValue = (value = '') => {
  const slug = toCategorySlug(value);
  if (!slug) return null;

  if (REVIEW_CATEGORY_ALIASES[slug]) {
    return REVIEW_CATEGORY_ALIASES[slug];
  }

  const fallbackEntry = Object.entries(REVIEW_CATEGORY_ALIASES).find(([keyword]) => slug.includes(keyword));
  return fallbackEntry ? fallbackEntry[1] : null;
};

const hydrateReview = (review) => {
  if (!review || typeof review !== 'object') return null;

  const eventType = review.eventType || review.event_type || '';
  const category = normalizeCategoryValue(review.category) || normalizeCategoryValue(eventType);
  const reviewText = review.reviewText || review.text || review.quote || '';
  const name = review.name || review.author || '';
  const rating = typeof review.rating === 'number' ? review.rating : Number.parseFloat(review.rating) || 5;
  const moderationState =
    review.moderationState ||
    review.moderation_state ||
    (typeof review.approved === 'boolean' ? (review.approved ? 'approved' : 'pending') : undefined) ||
    'approved';

  return {
    ...review,
    id: review.id || null,
    name: name || 'Onbekende klant',
    eventType,
    reviewText,
    rating,
    category: category || null,
    moderationState,
  };
};

const normaliseReviews = (reviews = []) => reviews.map(hydrateReview).filter(Boolean);

const updateFilterControls = () => {
  const buttons = document.querySelectorAll('[data-review-filter]');
  if (!buttons.length) return;

  buttons.forEach((button) => {
    const filter = button.dataset.reviewFilter || 'all';
    const isActive = filter === reviewState.activeCategory;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-pressed', isActive ? 'true' : 'false');
  });
};

const applyReviewFilter = () => {
  if (!reviewState.loaded) return;

  const { activeCategory, all } = reviewState;
  const filtered =
    activeCategory === 'all' ? all : all.filter((review) => review.category === activeCategory);

  renderReviews(filtered, reviewState.analytics);
};

const setActiveReviewCategory = (category) => {
  const normalised = category === 'all' ? 'all' : normalizeCategoryValue(category) || 'all';
  if (reviewState.activeCategory !== normalised) {
    reviewState.activeCategory = normalised;
  }
  updateFilterControls();
  applyReviewFilter();
};

const setupReviewFilterControls = () => {
  const buttons = document.querySelectorAll('[data-review-filter]');
  if (!buttons.length) return;

  buttons.forEach((button) => {
    if (button.dataset.reviewFilterBound === 'true') return;
    button.dataset.reviewFilterBound = 'true';

    button.addEventListener('click', (event) => {
      event.preventDefault();
      const filter = button.dataset.reviewFilter || 'all';
      const template = REVIEW_FILTER_EVENT_MAP[filter] || { persona: null, category: filter };
      const detail = { ...template };
      document.dispatchEvent(
        new CustomEvent('persona:change', {
          detail,
        })
      );
    });
  });

  updateFilterControls();
};

const setReviews = (reviews = []) => {
  reviewState.all = normaliseReviews(reviews);
  reviewState.loaded = true;
  applyReviewFilter();
  return reviewState.all;
};

const handlePersonaContext = (detail = {}) => {
  if (detail && detail.category === 'all') {
    setActiveReviewCategory('all');
    return;
  }

  const category =
    normalizeCategoryValue(detail?.category) ||
    normalizeCategoryValue(detail?.persona) ||
    normalizeCategoryValue(detail?.event_type);

  if (category) {
    setActiveReviewCategory(category);
  }
};

const renderReviews = (reviews, analytics) => {
  const container = document.getElementById('reviews-container');
  if (!container) return;

  if (!reviews.length) {
    container.innerHTML = '<p class="loading">Geen reviews beschikbaar</p>';
    return;
  }

  ensureReviewModerationStyles();

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
          ${
            review.moderationState && review.moderationState !== 'approved'
              ? `<span class="review-status review-status--${review.moderationState}">In afwachting van moderatie</span>`
              : ''
          }
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
    const apiData = await fetchJson('/api/packages');
    const packages = Array.isArray(apiData.packages) && apiData.packages.length ? apiData.packages : null;
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

  reviewState.analytics = analytics || null;
  reviewState.loaded = false;
  reviewState.all = [];

  setupReviewFilterControls();

  const cached = readCache(CACHE_KEYS.reviews);
  if (cached) {
    setReviews(cached);
  }

  try {
    const apiData = await fetchJson('/api/reviews');
    const reviews = Array.isArray(apiData.reviews) && apiData.reviews.length ? apiData.reviews : null;
    if (reviews) {
      const normalised = setReviews(reviews);
      writeCache(CACHE_KEYS.reviews, normalised);
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
      category: review.category,
      moderationState: review.moderationState || 'approved',
    }));
    const normalised = setReviews(formatted);
    writeCache(CACHE_KEYS.reviews, normalised);
  } catch (error) {
    console.error('Kon statische reviews niet laden.', error);
    setReviews([]);
  }
};

document.addEventListener('persona:change', (event) => {
  const detail = event.detail || {};
  highlightRecommendedPackage(detail.recommended_package);
  handlePersonaContext(detail);
});
