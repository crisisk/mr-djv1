// Mister DJ - Main JavaScript

const FALLBACK_PACKAGES = [
    {
        id: 'bronze',
        name: 'Brons Pakket',
        price: 795,
        duration: '4 uur',
        description: 'Ideaal voor compacte zalen en woonhuizen met complete basis setup.',
        features: [
            'Professionele DJ',
            'Geluidssysteem',
            'Basisverlichting',
            'Muziekvoorkeuren formulier',
            '100% Dansgarantie'
        ]
    },
    {
        id: 'silver',
        name: 'Zilver Pakket',
        price: 995,
        duration: '5 uur',
        description: 'Meest gekozen voor bruiloften – premium licht, geluid en persoonlijke voorbereiding.',
        features: [
            'Professionele DJ',
            'Premium geluidssysteem',
            'LED verlichting',
            'Rookmachine',
            'Muziekvoorkeuren formulier',
            'Persoonlijk intakegesprek',
            '100% Dansgarantie'
        ],
        popular: true
    },
    {
        id: 'gold',
        name: 'Goud Pakket',
        price: 1295,
        duration: '6 uur',
        description: 'Voor high-impact events met branding, special effects en uitgebreide show.',
        features: [
            'Professionele DJ',
            'Premium geluidssysteem',
            'Moving head verlichting',
            'Rookmachine',
            'DJ booth met logo',
            'Muziekvoorkeuren formulier',
            'Persoonlijk intakegesprek',
            'Saxofonist (optioneel)',
            '100% Dansgarantie'
        ]
    }
];

const FALLBACK_REVIEWS = [
    {
        id: 'sarah-tom',
        name: 'Sarah & Tom',
        eventType: 'Bruiloft 2024',
        rating: 5,
        reviewText: 'Mister DJ maakte onze bruiloft onvergetelijk! De dansvloer was de hele avond vol en de muziekkeuze was perfect.'
    },
    {
        id: 'mark-van-der-berg',
        name: 'Mark van der Berg',
        eventType: 'Corporate Event 2024',
        rating: 5,
        reviewText: 'Professioneel, betrouwbaar en geweldig in het lezen van het publiek. Ons bedrijfsfeest was een groot succes!'
    },
    {
        id: 'linda-janssen',
        name: 'Linda Janssen',
        eventType: '50 Jaar Jubileum 2024',
        rating: 5,
        reviewText: 'Van begin tot eind perfect geregeld. De 100% dansgarantie is geen loze belofte - iedereen stond op de dansvloer!'
    }
];

const CACHE_TTL_MS = 5 * 60 * 1000;
const CACHE_KEYS = {
    packages: 'misterdj.packages.v1',
    reviews: 'misterdj.reviews.v1'
};

const safeStorage = (() => {
    try {
        const testKey = '__misterdj_test__';
        window.sessionStorage.setItem(testKey, '1');
        window.sessionStorage.removeItem(testKey);
        return window.sessionStorage;
    } catch (error) {
        console.warn('SessionStorage niet beschikbaar, caching uitgeschakeld.');
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
        safeStorage.setItem(key, JSON.stringify({
            expiresAt: Date.now() + ttl,
            value
        }));
    } catch (error) {
        console.warn('Kon cache niet opslaan:', error);
    }
};

let packagesLoaded = false;
let reviewsLoaded = false;
let recommendedPackageName = null;
let revealObserver = null;

const prepareRevealElement = (element) => {
    if (!element) return;
    element.style.opacity = '0';
    element.style.transform = 'translateY(20px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';

    if (revealObserver) {
        revealObserver.observe(element);
    } else {
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
    }
};

const registerRevealTargets = (selector) => {
    document.querySelectorAll(selector).forEach(prepareRevealElement);
};

const renderPackages = (packages = []) => {
    const container = document.getElementById('packages-container');
    if (!container) return;

    if (!packages.length) {
        container.innerHTML = '<p class="loading">Geen pakketten beschikbaar</p>';
        return;
    }

    container.innerHTML = packages
        .map((pkg) => {
            const features = Array.isArray(pkg.features) ? pkg.features : [];
            const popularClass = pkg.popular ? 'popular' : '';
            return `
                <div class="package-card ${popularClass}" data-package-id="${pkg.id || ''}" data-package-name="${pkg.name}">
                    <div class="package-header">
                        <h3 class="package-name">${pkg.name}</h3>
                        <div class="package-price">€${pkg.price}</div>
                        <div class="package-duration">${pkg.duration || ''}</div>
                    </div>
                    ${pkg.description ? `<p class="package-description">${pkg.description}</p>` : ''}
                    <ul class="package-features">
                        ${features.map((feature) => `<li>✓ ${feature}</li>`).join('')}
                    </ul>
                    <a href="#contact" class="btn-primary" style="width: 100%; text-align: center;">Boek Nu</a>
                </div>
            `;
        })
        .join('');

    registerRevealTargets('#packages-container .package-card');
};

const renderReviews = (reviews = []) => {
    const container = document.getElementById('reviews-container');
    if (!container) return;

    if (!reviews.length) {
        container.innerHTML = '<p class="loading">Geen reviews beschikbaar</p>';
        return;
    }

    container.innerHTML = reviews
        .map((review) => `
            <div class="review-card">
                <div class="review-stars">${'⭐'.repeat(Math.round(review.rating || 5))}</div>
                <p class="review-text">"${review.reviewText || review.text}"</p>
                <div class="review-author">
                    <strong>${review.name}</strong>
                    <span>${review.eventType || ''}</span>
                </div>
            </div>
        `)
        .join('');

    registerRevealTargets('#reviews-container .review-card');
};

const highlightRecommendedPackage = () => {
    if (!recommendedPackageName) return;
    const cards = document.querySelectorAll('#packages-container .package-card');
    cards.forEach((card) => {
        const cardName = (card.getAttribute('data-package-name') || '').toLowerCase();
        const isMatch = cardName === recommendedPackageName.toLowerCase();
        card.classList.toggle('recommended', isMatch);
    });
};

const loadPackages = async (force = false) => {
    const container = document.getElementById('packages-container');
    if (!container || (packagesLoaded && !force)) return;

    const cached = !force ? readCache(CACHE_KEYS.packages) : null;
    if (cached) {
        renderPackages(cached);
        packagesLoaded = true;
        highlightRecommendedPackage();
        return;
    }

    try {
        const response = await fetch('/api/packages', { headers: { 'Accept': 'application/json' } });
        if (!response.ok) throw new Error('Failed to load packages');
        const data = await response.json();
        const packages = Array.isArray(data.packages) && data.packages.length ? data.packages : FALLBACK_PACKAGES;
        renderPackages(packages);
        writeCache(CACHE_KEYS.packages, packages);
    } catch (error) {
        console.error('Error loading packages:', error);
        renderPackages(FALLBACK_PACKAGES);
    }

    packagesLoaded = true;
    highlightRecommendedPackage();
};

const loadReviews = async (force = false) => {
    const container = document.getElementById('reviews-container');
    if (!container || (reviewsLoaded && !force)) return;

    const cached = !force ? readCache(CACHE_KEYS.reviews) : null;
    if (cached) {
        renderReviews(cached);
        reviewsLoaded = true;
        return;
    }

    try {
        const response = await fetch('/api/reviews', { headers: { 'Accept': 'application/json' } });
        if (!response.ok) throw new Error('Failed to load reviews');
        const data = await response.json();
        const reviews = Array.isArray(data.reviews) && data.reviews.length ? data.reviews : FALLBACK_REVIEWS;
        renderReviews(reviews);
        writeCache(CACHE_KEYS.reviews, reviews);
    } catch (error) {
        console.error('Error loading reviews:', error);
        renderReviews(FALLBACK_REVIEWS);
    }

    reviewsLoaded = true;
};

const observeSection = (element, callback) => {
    if (!element || typeof callback !== 'function') return;

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, observerInstance) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    callback();
                    observerInstance.disconnect();
                }
            });
        }, { rootMargin: '0px 0px -20% 0px' });

        observer.observe(element);
    } else {
        callback();
    }
};

const initNavigation = () => {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navbar = document.querySelector('.navbar');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        document.querySelectorAll('.nav-menu a').forEach((link) => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', (event) => {
            const href = anchor.getAttribute('href');
            if (!href || href === '#') return;
            const target = document.querySelector(href);
            if (!target) return;
            event.preventDefault();
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });

    if (navbar) {
        const updateShadow = () => {
            const currentScroll = window.pageYOffset;
            if (currentScroll > 100) {
                navbar.style.boxShadow = '0 4px 12px rgba(26, 44, 75, 0.15)';
            } else {
                navbar.style.boxShadow = '0 2px 8px rgba(26, 44, 75, 0.1)';
            }
        };

        window.addEventListener('scroll', updateShadow, { passive: true });
        updateShadow();
    }
};

const setupAudienceMatcher = () => {
    const tabs = Array.from(document.querySelectorAll('.audience-tab'));
    const panels = Array.from(document.querySelectorAll('.audience-panel'));
    if (!tabs.length || !panels.length) return;

    const eventTypeField = document.getElementById('eventType');
    const messageField = document.getElementById('message');
    const eventTypeToPersona = {
        bruiloft: 'bruiloft',
        bedrijfsfeest: 'bedrijfsfeest',
        verjaardag: 'private',
        jubileum: 'private'
    };

    let activePersona = null;
    let messageEditedManually = false;

    if (messageField) {
        messageField.addEventListener('input', () => {
            if (messageField.dataset.autofilled === 'true') {
                messageField.dataset.autofilled = 'false';
            }
            messageEditedManually = messageField.value.trim().length > 0;
        });
    }

    const activatePersona = (persona, { force = false } = {}) => {
        if (!persona) return;
        if (activePersona === persona && !force) return;
        activePersona = persona;

        tabs.forEach((tab) => {
            const isActive = tab.dataset.persona === persona;
            tab.classList.toggle('active', isActive);
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });

        panels.forEach((panel) => {
            const isActive = panel.dataset.persona === persona;
            panel.classList.toggle('active', isActive);
            if (isActive && typeof panel.focus === 'function') {
                panel.focus();
            }
        });

        const activePanel = panels.find((panel) => panel.dataset.persona === persona);
        if (!activePanel) return;

        recommendedPackageName = activePanel.dataset.package || null;
        highlightRecommendedPackage();

        if (eventTypeField && activePanel.dataset.eventType) {
            eventTypeField.value = activePanel.dataset.eventType;
        }

        if (messageField) {
            const suggestedMessage = activePanel.dataset.message;
            if (suggestedMessage && (!messageEditedManually || !messageField.value.trim())) {
                messageField.value = suggestedMessage;
                messageField.dataset.autofilled = 'true';
                messageEditedManually = false;
            }

            const keywords = activePanel.dataset.keywords;
            if (keywords) {
                messageField.placeholder = `Vertel ons meer (${keywords.toLowerCase()})`;
            }
        }
    };

    tabs.forEach((tab) => {
        tab.addEventListener('click', () => activatePersona(tab.dataset.persona));
        tab.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                activatePersona(tab.dataset.persona);
            }
        });
    });

    if (eventTypeField) {
        eventTypeField.addEventListener('change', (event) => {
            const persona = eventTypeToPersona[event.target.value];
            if (persona) {
                activatePersona(persona);
            }
        });
    }

    document.addEventListener('contact:formReset', () => {
        messageEditedManually = false;
        if (messageField) {
            messageField.dataset.autofilled = 'false';
        }
        if (activePersona) {
            activatePersona(activePersona, { force: true });
        }
    });

    activatePersona(tabs[0]?.dataset.persona || 'bruiloft');
};

const setupContactForm = () => {
    const contactForm = document.getElementById('contact-form');
    const formMessage = document.getElementById('form-message');
    if (!contactForm || !formMessage) return;

    contactForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            eventType: document.getElementById('eventType').value,
            eventDate: document.getElementById('eventDate').value,
            message: document.getElementById('message').value
        };

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                const validationMessage = Array.isArray(data.details)
                    ? data.details.map((detail) => `${detail.field}: ${detail.message}`).join(' ')
                    : (data.message || data.error);
                throw new Error(validationMessage || 'Er is iets misgegaan');
            }

            formMessage.className = 'form-message success';
            formMessage.textContent = data.message;
            contactForm.reset();
            document.dispatchEvent(new Event('contact:formReset'));
        } catch (error) {
            formMessage.className = 'form-message error';
            formMessage.textContent = error.message || 'Er is een fout opgetreden. Probeer het later opnieuw of bel ons direct.';
            console.error('Form submission error:', error);
        }

        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
};

const initRevealObserver = () => {
    if ('IntersectionObserver' in window) {
        revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -10% 0px'
        });
    }
};

const init = () => {
    initNavigation();
    initRevealObserver();

    registerRevealTargets('.usp-card, .service-card, .about-card, .faq-item');

    setupAudienceMatcher();
    setupContactForm();

    const packagesSection = document.getElementById('pakketten');
    const reviewsSection = document.getElementById('reviews');

    observeSection(packagesSection, () => loadPackages());
    observeSection(reviewsSection, () => loadReviews());

    // Fallback prefetch wanneer gebruiker direct navigeert naar contact
    setTimeout(() => {
        if (!packagesLoaded) loadPackages();
        if (!reviewsLoaded) loadReviews();
    }, 4000);
};

document.addEventListener('DOMContentLoaded', init);

console.log('%c🎧 Mister DJ Website', 'font-size: 20px; font-weight: bold; color: #00AEEF;');
console.log('%cDé feestspecialist van het Zuiden', 'font-size: 14px; color: #1A2C4B;');
console.log('%c100% Dansgarantie | 15+ jaar | 2500+ events', 'font-size: 12px; color: #D4AF37;');
