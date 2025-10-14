// Mister DJ - Main JavaScript

// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offset = 80; // navbar height
            const targetPosition = target.offsetTop - offset;
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar Scroll Effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 4px 12px rgba(26, 44, 75, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(26, 44, 75, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Load Packages from API
async function loadPackages() {
    const container = document.getElementById('packages-container');
    
    try {
        const response = await fetch('/api/packages');
        const data = await response.json();
        
        if (data.packages && data.packages.length > 0) {
            container.innerHTML = data.packages.map(pkg => `
                <div class="package-card ${pkg.popular ? 'popular' : ''}">
                    <div class="package-header">
                        <h3 class="package-name">${pkg.name}</h3>
                        <div class="package-price">€${pkg.price}</div>
                        <div class="package-duration">${pkg.duration}</div>
                    </div>
                    <ul class="package-features">
                        ${pkg.features.map(feature => `<li>✓ ${feature}</li>`).join('')}
                    </ul>
                    <a href="#contact" class="btn-primary" style="width: 100%; text-align: center;">Boek Nu</a>
                </div>
            `).join('');
        } else {
            container.innerHTML = '<p class="loading">Geen pakketten beschikbaar</p>';
        }
    } catch (error) {
        console.error('Error loading packages:', error);
        container.innerHTML = `
            <div class="package-card">
                <div class="package-header">
                    <h3 class="package-name">Brons Pakket</h3>
                    <div class="package-price">€795</div>
                    <div class="package-duration">4 uur</div>
                </div>
                <ul class="package-features">
                    <li>✓ Professionele DJ</li>
                    <li>✓ Geluidssysteem</li>
                    <li>✓ Basisverlichting</li>
                    <li>✓ Muziekvoorkeuren formulier</li>
                    <li>✓ 100% Dansgarantie</li>
                </ul>
                <a href="#contact" class="btn-primary" style="width: 100%; text-align: center;">Boek Nu</a>
            </div>
            <div class="package-card popular">
                <div class="package-header">
                    <h3 class="package-name">Zilver Pakket</h3>
                    <div class="package-price">€995</div>
                    <div class="package-duration">5 uur</div>
                </div>
                <ul class="package-features">
                    <li>✓ Professionele DJ</li>
                    <li>✓ Premium geluidssysteem</li>
                    <li>✓ LED verlichting</li>
                    <li>✓ Rookmachine</li>
                    <li>✓ Muziekvoorkeuren formulier</li>
                    <li>✓ Persoonlijk intakegesprek</li>
                    <li>✓ 100% Dansgarantie</li>
                </ul>
                <a href="#contact" class="btn-primary" style="width: 100%; text-align: center;">Boek Nu</a>
            </div>
            <div class="package-card">
                <div class="package-header">
                    <h3 class="package-name">Goud Pakket</h3>
                    <div class="package-price">€1295</div>
                    <div class="package-duration">6 uur</div>
                </div>
                <ul class="package-features">
                    <li>✓ Professionele DJ</li>
                    <li>✓ Premium geluidssysteem</li>
                    <li>✓ Moving head verlichting</li>
                    <li>✓ Rookmachine</li>
                    <li>✓ DJ booth met logo</li>
                    <li>✓ Muziekvoorkeuren formulier</li>
                    <li>✓ Persoonlijk intakegesprek</li>
                    <li>✓ Saxofonist (optioneel)</li>
                    <li>✓ 100% Dansgarantie</li>
                </ul>
                <a href="#contact" class="btn-primary" style="width: 100%; text-align: center;">Boek Nu</a>
            </div>
        `;
    }
}

// Contact Form Submission
const contactForm = document.getElementById('contact-form');
const formMessage = document.getElementById('form-message');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
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
            
            if (data.success) {
                formMessage.className = 'form-message success';
                formMessage.textContent = data.message;
                contactForm.reset();
            } else {
                throw new Error(data.message || 'Er is iets misgegaan');
            }
        } catch (error) {
            formMessage.className = 'form-message error';
            formMessage.textContent = 'Er is een fout opgetreden. Probeer het later opnieuw of bel ons direct.';
            console.error('Form submission error:', error);
        }
        
        // Scroll to message
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadPackages();
    
    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe all cards and sections
    document.querySelectorAll('.usp-card, .service-card, .package-card, .review-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Console log
console.log('%c🎧 Mister DJ Website', 'font-size: 20px; font-weight: bold; color: #00AEEF;');
console.log('%cDé feestspecialist van het Zuiden', 'font-size: 14px; color: #1A2C4B;');
console.log('%c100% Dansgarantie | 15+ jaar | 2500+ events', 'font-size: 12px; color: #D4AF37;');

