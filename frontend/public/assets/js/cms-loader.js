// Netlify CMS Content Loader
// Laadt content van JSON files en update de pagina

class CMSLoader {
    constructor() {
        this.contentPath = '/content';
        this.init();
    }

    async init() {
        try {
            await this.loadHomepage();
            await this.loadPakketten();
            await this.loadAddons();
            await this.loadReviews();
            await this.loadSettings();
        } catch (error) {
            console.error('Error loading CMS content:', error);
        }
    }

    async loadJSON(path) {
        const response = await fetch(`${this.contentPath}/${path}`);
        if (!response.ok) throw new Error(`Failed to load ${path}`);
        return await response.json();
    }

    async loadHomepage() {
        const data = await this.loadJSON('homepage.json');
        
        // Update hero section
        const heroTitle = document.getElementById('heroTitle');
        const heroSubtitle = document.getElementById('heroSubtitle');
        const heroCTA = document.getElementById('heroCTA');
        
        if (heroTitle) heroTitle.textContent = data.hero_title;
        if (heroSubtitle) heroSubtitle.textContent = data.hero_subtitle;
        if (heroCTA) heroCTA.textContent = data.hero_cta;

        // Update USPs
        const usp1 = document.getElementById('usp1');
        const usp2 = document.getElementById('usp2');
        const usp3 = document.getElementById('usp3');
        
        if (usp1) usp1.textContent = data.usp_1;
        if (usp2) usp2.textContent = data.usp_2;
        if (usp3) usp3.textContent = data.usp_3;

        // Update about section
        const aboutTitle = document.getElementById('aboutTitle');
        const aboutText = document.getElementById('aboutText');
        
        if (aboutTitle) aboutTitle.textContent = data.about_title;
        if (aboutText) aboutText.textContent = data.about_text;
    }

    async loadPakketten() {
        const pakketten = [];
        const pakketNames = ['brons', 'zilver', 'goud'];
        
        for (const name of pakketNames) {
            try {
                const pakket = await this.loadJSON(`pakketten/${name}.json`);
                pakketten.push(pakket);
            } catch (error) {
                console.warn(`Could not load pakket: ${name}`);
            }
        }

        // Sort by order
        pakketten.sort((a, b) => a.order - b.order);

        // Render pakketten
        const grid = document.getElementById('pakkettenGrid');
        if (!grid) return;

        grid.innerHTML = pakketten.map(pakket => `
            <div class="pakket-card ${pakket.popular ? 'popular' : ''}">
                ${pakket.popular ? '<div class="popular-badge">Meest Gekozen</div>' : ''}
                <h3>${pakket.title}</h3>
                <div class="price">€${pakket.price}</div>
                <p class="description">${pakket.description}</p>
                <ul class="features">
                    ${pakket.features.map(feature => `<li>${feature}</li>`).join('')}
                </ul>
                <a href="#contact" class="btn btn-secondary">Aanvragen</a>
            </div>
        `).join('');
    }

    async loadAddons() {
        const addons = [];
        const addonNames = ['photobooth', 'led-vloer', 'sparkulars'];
        
        for (const name of addonNames) {
            try {
                const addon = await this.loadJSON(`addons/${name}.json`);
                addons.push(addon);
            } catch (error) {
                console.warn(`Could not load addon: ${name}`);
            }
        }

        // Render addons
        const grid = document.getElementById('addonsGrid');
        if (!grid) return;

        grid.innerHTML = addons.map(addon => `
            <div class="addon-card">
                <h3>${addon.title}</h3>
                <div class="price">€${addon.price}</div>
                <p>${addon.description}</p>
            </div>
        `).join('');
    }

    async loadReviews() {
        const reviews = [];
        const reviewNames = ['jan-en-marie']; // Add more as they're created
        
        for (const name of reviewNames) {
            try {
                const review = await this.loadJSON(`reviews/${name}.json`);
                reviews.push(review);
            } catch (error) {
                console.warn(`Could not load review: ${name}`);
            }
        }

        // Render reviews
        const grid = document.getElementById('reviewsGrid');
        if (!grid) return;

        grid.innerHTML = reviews.map(review => `
            <div class="review-card">
                <div class="rating">${'⭐'.repeat(review.rating)}</div>
                <p class="review-text">"${review.text}"</p>
                <p class="review-author">- ${review.name}</p>
                <p class="review-event">${review.event_type}</p>
            </div>
        `).join('');
    }

    async loadSettings() {
        const settings = await this.loadJSON('settings/general.json');
        
        // Update contact info
        const phone = document.getElementById('contactPhone');
        const email = document.getElementById('contactEmail');
        const address = document.getElementById('contactAddress');
        const kvk = document.getElementById('contactKvK');
        
        if (phone) phone.textContent = settings.phone;
        if (email) email.textContent = settings.email;
        if (address) address.innerHTML = settings.address.replace(/\n/g, '<br>');
        if (kvk) kvk.textContent = settings.kvk;

        // Update social links
        const socialLinks = document.getElementById('socialLinks');
        if (socialLinks) {
            const links = [];
            if (settings.facebook) links.push(`<a href="${settings.facebook}" target="_blank">Facebook</a>`);
            if (settings.instagram) links.push(`<a href="${settings.instagram}" target="_blank">Instagram</a>`);
            if (settings.linkedin) links.push(`<a href="${settings.linkedin}" target="_blank">LinkedIn</a>`);
            socialLinks.innerHTML = links.join(' | ');
        }
    }
}

// Initialize CMS Loader when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new CMSLoader());
} else {
    new CMSLoader();
}
